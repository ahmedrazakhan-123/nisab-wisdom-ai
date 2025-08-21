import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ChatRequest {
  user_id: string;
  message: string;
}

interface ChatResponse {
  response: string;
  timestamp: string;
  provider: string;
  model: string;
}

// API Configuration
const ANTHROPIC_API_KEY = Deno.env.get('ANTHROPIC_API_KEY');
const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// Rate limiting map (in production, use Redis)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

class ChatbotService {
  private async checkRateLimit(userId: string): Promise<boolean> {
    const now = Date.now();
    const windowMs = 60000; // 1 minute
    const maxRequests = 20;
    
    const userLimit = rateLimitMap.get(userId);
    if (!userLimit || now > userLimit.resetTime) {
      rateLimitMap.set(userId, { count: 1, resetTime: now + windowMs });
      return true;
    }
    
    if (userLimit.count >= maxRequests) {
      return false;
    }
    
    userLimit.count++;
    return true;
  }

  private async getConversationHistory(userId: string, limit = 5): Promise<Array<{role: string; content: string}>> {
    const { data: conversations, error } = await supabase
      .from('conversations')
      .select('message, response')
      .eq('user_id', userId)
      .order('timestamp', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching conversation history:', error);
      return [];
    }

    const history: Array<{role: string; content: string}> = [];
    
    // Reverse to get chronological order and format for API
    conversations.reverse().forEach(conv => {
      history.push({ role: 'user', content: conv.message });
      history.push({ role: 'assistant', content: conv.response });
    });

    return history;
  }

  private async callAnthropicAPI(messages: Array<{role: string; content: string}>, retries = 2): Promise<{response: string; model: string}> {
    const systemPrompt = `You are an expert Islamic finance advisor and scholar. You provide guidance based on:

1. The Quran and authentic Hadith
2. AAOIFI (Accounting and Auditing Organization for Islamic Financial Institutions) standards
3. Scholarly consensus (Ijma') from reputable Islamic finance scholars
4. Modern Islamic banking and finance principles

IMPORTANT GUIDELINES:
- Always cite your sources (Quran verses, Hadith references, AAOIFI standards)
- Be clear about what is halal, haram, or doubtful (mashkook)
- Provide practical, actionable advice
- When uncertain, recommend consulting local Islamic scholars
- Focus on substance over form in financial transactions
- Consider the spirit of Islamic law (Maqasid al-Shariah)`;

    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const response = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': ANTHROPIC_API_KEY!,
            'anthropic-version': '2023-06-01'
          },
          body: JSON.stringify({
            model: 'claude-3-5-sonnet-20241022',
            max_tokens: 1000,
            system: systemPrompt,
            messages: messages
          })
        });

        if (!response.ok) {
          throw new Error(`Anthropic API error: ${response.status} ${await response.text()}`);
        }

        const data = await response.json();
        return {
          response: data.content[0].text,
          model: 'claude-3-5-sonnet-20241022'
        };
      } catch (error) {
        console.error(`Anthropic API attempt ${attempt + 1} failed:`, error);
        if (attempt === retries) {
          throw error;
        }
        // Wait before retry (exponential backoff)
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
      }
    }
    
    throw new Error('All Anthropic API attempts failed');
  }

  private async callOpenAIAPI(messages: Array<{role: string; content: string}>, retries = 2): Promise<{response: string; model: string}> {
    const systemMessage = {
      role: 'system' as const,
      content: `You are an expert Islamic finance advisor and scholar. You provide guidance based on:

1. The Quran and authentic Hadith
2. AAOIFI (Accounting and Auditing Organization for Islamic Financial Institutions) standards
3. Scholarly consensus (Ijma') from reputable Islamic finance scholars
4. Modern Islamic banking and finance principles

IMPORTANT GUIDELINES:
- Always cite your sources (Quran verses, Hadith references, AAOIFI standards)
- Be clear about what is halal, haram, or doubtful (mashkook)
- Provide practical, actionable advice
- When uncertain, recommend consulting local Islamic scholars
- Focus on substance over form in financial transactions
- Consider the spirit of Islamic law (Maqasid al-Shariah)`
    };

    const apiMessages = [systemMessage, ...messages];

    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${OPENAI_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'gpt-4.1-mini-2025-04-14',
            messages: apiMessages,
            max_tokens: 1000,
            temperature: 0.3,
          }),
        });

        if (!response.ok) {
          throw new Error(`OpenAI API error: ${response.status} ${await response.text()}`);
        }

        const data = await response.json();
        return {
          response: data.choices[0].message.content,
          model: 'gpt-4.1-mini-2025-04-14'
        };
      } catch (error) {
        console.error(`OpenAI API attempt ${attempt + 1} failed:`, error);
        if (attempt === retries) {
          throw error;
        }
        // Wait before retry (exponential backoff)
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
      }
    }
    
    throw new Error('All OpenAI API attempts failed');
  }

  async generateResponse(userId: string, message: string): Promise<ChatResponse> {
    // Check rate limit
    const withinLimit = await this.checkRateLimit(userId);
    if (!withinLimit) {
      throw new Error('Rate limit exceeded. Please wait before sending another message.');
    }

    // Get conversation history
    const history = await this.getConversationHistory(userId);
    
    // Add current message
    const messages = [...history, { role: 'user', content: message }];

    let response: string;
    let provider: string;
    let model: string;

    try {
      // Try Anthropic first
      if (ANTHROPIC_API_KEY) {
        const result = await this.callAnthropicAPI(messages);
        response = result.response;
        model = result.model;
        provider = 'anthropic';
      } else {
        throw new Error('Anthropic API key not available');
      }
    } catch (error) {
      console.error('Anthropic API failed, trying OpenAI fallback:', error);
      
      // Fallback to OpenAI
      if (OPENAI_API_KEY) {
        const result = await this.callOpenAIAPI(messages);
        response = result.response;
        model = result.model;
        provider = 'openai';
      } else {
        throw new Error('Both Anthropic and OpenAI API keys are unavailable');
      }
    }

    const timestamp = new Date().toISOString();

    // Store conversation in database
    const { error: dbError } = await supabase
      .from('conversations')
      .insert({
        user_id: userId,
        message: message,
        response: response,
        provider: provider,
        model: model,
        timestamp: timestamp
      });

    if (dbError) {
      console.error('Error saving conversation:', dbError);
      // Don't throw here - we still want to return the response
    }

    // Log audit event
    await supabase.from('audit_logs').insert({
      user_id: userId,
      action: 'chat_request',
      resource_type: 'chat',
      metadata: { 
        message_length: message.length,
        response_length: response.length,
        provider: provider,
        model: model
      }
    });

    return {
      response,
      timestamp,
      provider,
      model
    };
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { user_id, message }: ChatRequest = await req.json();

    // Validate input
    if (!user_id || !message) {
      return new Response(
        JSON.stringify({ 
          error: 'Missing required fields: user_id and message',
          data: null,
          meta: { timestamp: new Date().toISOString() }
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    if (message.length > 4000) {
      return new Response(
        JSON.stringify({ 
          error: 'Message too long. Maximum 4000 characters.',
          data: null,
          meta: { timestamp: new Date().toISOString() }
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const chatService = new ChatbotService();
    const result = await chatService.generateResponse(user_id, message);

    return new Response(
      JSON.stringify({
        data: result,
        error: null,
        meta: { 
          timestamp: new Date().toISOString(),
          request_id: crypto.randomUUID()
        }
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Chat endpoint error:', error);
    
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Internal server error',
        data: null,
        meta: { 
          timestamp: new Date().toISOString(),
          request_id: crypto.randomUUID()
        }
      }),
      { 
        status: error instanceof Error && error.message.includes('Rate limit') ? 429 : 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});