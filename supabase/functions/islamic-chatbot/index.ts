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

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { query, user_id } = await req.json();
    
    console.log('Islamic chatbot query:', query);

    // Log audit event
    if (user_id) {
      await supabase.from('audit_logs').insert({
        user_id,
        action: 'compliance_check',
        resource_type: 'chatbot',
        metadata: { query }
      });
    }

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

    // Prepare context for AI response
    let context = '';
    if (knowledgeEntries && knowledgeEntries.length > 0) {
      context = knowledgeEntries
        .map((entry: any) => `Source: ${entry.source} - ${entry.source_reference}\n${entry.content}`)
        .join('\n\n');
    }

    // Check if we have relevant knowledge base results
    if (!knowledgeEntries || knowledgeEntries.length === 0 || 
        (knowledgeEntries[0] && knowledgeEntries[0].similarity < 0.8)) {
      return new Response(
        JSON.stringify({
          response: "I don't know the answer to that based on verified Islamic finance sources.",
          sources: [],
          confidence: 'low'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Generate AI response with strict RAG-only context
    const systemPrompt = `You are Nisab, an Islamic finance advisor. Always:
- Answer ONLY from the verified RAG knowledge base provided below.
- If information is not in the knowledge base, say 'I don't know.'
- Never invent or add unrelated explanations.
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
        model: 'gpt-4-turbo-preview',
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
        confidence: knowledgeEntries?.length > 0 ? 'high' : 'medium'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

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