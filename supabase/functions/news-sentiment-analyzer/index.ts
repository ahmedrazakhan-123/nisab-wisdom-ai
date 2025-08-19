import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const newsApiKey = Deno.env.get('NEWS_API_KEY');
const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Starting news sentiment analysis...');

    // Fetch latest financial and crypto news
    const keywords = [
      'cryptocurrency', 'bitcoin', 'ethereum', 'blockchain', 
      'islamic finance', 'halal investing', 'sukuk', 'takaful',
      'sharia compliant', 'islamic banking'
    ];

    let totalArticlesProcessed = 0;

    for (const keyword of keywords) {
      try {
        // Fetch news from NewsAPI
        const newsResponse = await fetch(
          `https://newsapi.org/v2/everything?q=${encodeURIComponent(keyword)}&language=en&sortBy=publishedAt&pageSize=20`,
          {
            headers: {
              'X-API-Key': newsApiKey!
            }
          }
        );

        if (!newsResponse.ok) {
          console.error(`NewsAPI error for keyword "${keyword}":`, newsResponse.status);
          continue;
        }

        const newsData = await newsResponse.json();
        
        for (const article of newsData.articles || []) {
          try {
            // Check if article already exists
            const { data: existingArticle } = await supabase
              .from('news_articles')
              .select('id')
              .eq('url', article.url)
              .single();

            if (existingArticle) {
              continue; // Skip if already processed
            }

            // Analyze sentiment using OpenAI
            const sentimentAnalysis = await analyzeSentiment(article.title, article.description || '');
            
            // Identify related assets
            const relatedAssets = await identifyRelatedAssets(article.title, article.description || '');

            // Insert article with sentiment analysis
            const { error: insertError } = await supabase
              .from('news_articles')
              .insert({
                title: article.title,
                content: article.description || article.title,
                url: article.url,
                source: article.source?.name || 'Unknown',
                published_at: article.publishedAt,
                sentiment_score: sentimentAnalysis.score,
                sentiment_label: sentimentAnalysis.label,
                related_assets: relatedAssets,
                tags: [keyword]
              });

            if (insertError) {
              console.error('Error inserting article:', insertError);
            } else {
              totalArticlesProcessed++;
            }

          } catch (articleError) {
            console.error('Error processing article:', articleError);
          }
        }

        // Rate limiting - wait between keyword searches
        await new Promise(resolve => setTimeout(resolve, 1000));

      } catch (keywordError) {
        console.error(`Error processing keyword "${keyword}":`, keywordError);
      }
    }

    console.log(`Processed ${totalArticlesProcessed} new articles`);

    return new Response(
      JSON.stringify({
        success: true,
        articles_processed: totalArticlesProcessed,
        keywords_searched: keywords.length,
        message: 'News sentiment analysis completed'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('News sentiment analyzer error:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Failed to analyze news sentiment',
        details: error.message 
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});

async function analyzeSentiment(title: string, description: string): Promise<{ score: number; label: string }> {
  try {
    const text = `${title}. ${description}`.substring(0, 1000); // Limit text length

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [{
          role: 'user',
          content: `Analyze the sentiment of this financial news text and provide a score from -1 (very negative) to 1 (very positive), and a label (positive/negative/neutral). Focus on market sentiment and financial implications.

Text: "${text}"

Respond with only a JSON object: {"score": number, "label": "positive|negative|neutral"}`
        }],
        max_tokens: 100,
        temperature: 0.1,
      }),
    });

    const data = await response.json();
    const result = JSON.parse(data.choices[0].message.content);
    
    return {
      score: Math.max(-1, Math.min(1, result.score || 0)),
      label: result.label || 'neutral'
    };

  } catch (error) {
    console.error('Sentiment analysis error:', error);
    return { score: 0, label: 'neutral' };
  }
}

async function identifyRelatedAssets(title: string, description: string): Promise<string[]> {
  try {
    // Get known asset symbols from database
    const { data: assets, error } = await supabase
      .from('assets')
      .select('id, symbol, name')
      .limit(100);

    if (error || !assets) {
      return [];
    }

    const text = `${title} ${description}`.toLowerCase();
    const relatedAssetIds: string[] = [];

    // Simple keyword matching for now
    for (const asset of assets) {
      if (text.includes(asset.symbol.toLowerCase()) || 
          text.includes(asset.name.toLowerCase())) {
        relatedAssetIds.push(asset.id);
      }
    }

    return relatedAssetIds;

  } catch (error) {
    console.error('Error identifying related assets:', error);
    return [];
  }
}