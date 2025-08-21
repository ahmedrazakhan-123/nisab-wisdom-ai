import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Query classification function
async function classifyQuery(query: string): Promise<'islamic_finance' | 'general' | 'greeting'> {
  const lowerQuery = query.toLowerCase();
  
  // Greeting patterns
  const greetingPatterns = [
    /^(hi|hello|hey|good\s+(morning|afternoon|evening)|assalam|salam)/,
    /^(how are you|what's up|wassup)/,
    /^(thanks?|thank you|bye|goodbye|see you)/
  ];
  
  if (greetingPatterns.some(pattern => pattern.test(lowerQuery))) {
    return 'greeting';
  }
  
  // Islamic finance keywords
  const islamicFinanceKeywords = [
    'halal', 'haram', 'riba', 'interest', 'zakat', 'islamic bank', 'shariah',
    'sukuk', 'takaful', 'mudaraba', 'musharaka', 'ijara', 'salam', 'istisna',
    'murabaha', 'qard', 'wadiah', 'gharar', 'maysir', 'aaoifi', 'islamic finance',
    'islamic investment', 'crypto halal', 'bitcoin', 'cryptocurrency', 'forex',
    'trading', 'stock', 'bond', 'insurance', 'mortgage', 'loan'
  ];
  
  if (islamicFinanceKeywords.some(keyword => lowerQuery.includes(keyword))) {
    return 'islamic_finance';
  }
  
  return 'general';
}

// Handle greeting responses
function handleGreeting(query: string): string {
  const lowerQuery = query.toLowerCase();
  
  if (lowerQuery.includes('assalam') || lowerQuery.includes('salam')) {
    return "Wa alaykum assalam! How can I help you with Islamic finance today?";
  }
  
  if (lowerQuery.includes('thank') || lowerQuery.includes('bye') || lowerQuery.includes('goodbye')) {
    return "You're welcome! May Allah bless you. Feel free to ask if you have more questions about Islamic finance.";
  }
  
  return "Hello! I'm Nisab, your Islamic finance advisor. How can I help you today?";
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { query, user_id } = await req.json();
    
    console.log('Islamic chatbot query:', query);
    console.log('Classifying query...');

    // Log audit event
    if (user_id) {
      await supabase.from('audit_logs').insert({
        user_id,
        action: 'compliance_check',
        resource_type: 'chatbot',
        metadata: { query }
      });
    }

    // Step 1: Classify the query
    const queryType = await classifyQuery(query);
    console.log('Query classified as:', queryType);

    // Step 2: Route based on classification
    if (queryType === 'greeting') {
      const response = handleGreeting(query);
      return new Response(
        JSON.stringify({
          response,
          sources: [],
          confidence: 'high',
          query_type: 'greeting'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (queryType === 'islamic_finance') {
      // Use RAG pipeline for Islamic finance questions
      console.log('Using RAG pipeline for Islamic finance query');
      
      // Generate embedding for the query
      const embeddingResponse = await fetch('https://api.openai.com/v1/embeddings', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openAIApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'text-embedding-ada-002',
          input: query,
        }),
      });

      const embeddingData = await embeddingResponse.json();
      const embedding = embeddingData.data[0].embedding;

      // Search knowledge base using vector similarity
      const { data: knowledgeEntries, error: searchError } = await supabase.rpc(
        'search_knowledge_base',
        {
          query_embedding: embedding,
          match_threshold: 0.8,
          match_count: 5
        }
      );

      if (searchError) {
        console.error('Knowledge base search error:', searchError);
      }

      // Check if we have relevant knowledge base results
      if (!knowledgeEntries || knowledgeEntries.length === 0 || 
          (knowledgeEntries[0] && knowledgeEntries[0].similarity < 0.8)) {
        return new Response(
          JSON.stringify({
            response: "I don't know the answer to that based on verified Islamic finance sources.",
            sources: [],
            confidence: 'low',
            query_type: 'islamic_finance'
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Prepare context for AI response
      const context = knowledgeEntries
        .map((entry: any) => `Source: ${entry.source} - ${entry.source_reference}\n${entry.content}`)
        .join('\n\n');

      // Generate AI response with RAG context
      const systemPrompt = `You are Nisab, an Islamic finance advisor chatbot. 
- Always use verified RAG knowledge base for Islamic finance questions.
- Answer ONLY from the verified knowledge base provided below.
- If information is not in the knowledge base, say 'I don't know based on verified sources.'
- Keep answers short, clear, and directly related to the user's question.
- Only answer what was specifically asked - no extra definitions unless requested.

Available knowledge base context:
${context}

Answer the user's question using only the information above.`;

      const chatResponse = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openAIApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: query }
          ],
          max_tokens: 1000,
          temperature: 0.3,
        }),
      });

      const chatData = await chatResponse.json();
      const response = chatData.choices[0].message.content;

      // Extract sources from knowledge base entries
      const sources = knowledgeEntries?.map((entry: any) => ({
        title: entry.title,
        source: entry.source,
        reference: entry.source_reference
      })) || [];

      return new Response(
        JSON.stringify({
          response,
          sources,
          confidence: 'high',
          query_type: 'islamic_finance'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (queryType === 'general') {
      // Use fallback LLM for general questions
      console.log('Using fallback LLM for general query');
      
      const systemPrompt = `You are Nisab, an Islamic finance advisor chatbot. 
- For general questions, provide helpful and accurate information.
- Keep responses concise and informative.
- If the question could be related to Islamic finance, gently suggest they ask specific Islamic finance questions for more detailed guidance.`;

      const chatResponse = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openAIApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: query }
          ],
          max_tokens: 500,
          temperature: 0.7,
        }),
      });

      const chatData = await chatResponse.json();
      const response = chatData.choices[0].message.content;

      return new Response(
        JSON.stringify({
          response,
          sources: [],
          confidence: 'medium',
          query_type: 'general'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

  } catch (error) {
    console.error('Islamic chatbot error:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Failed to process query',
        details: error.message 
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});