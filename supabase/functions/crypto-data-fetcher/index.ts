import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const coinMarketCapApiKey = Deno.env.get('COINMARKETCAP_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Starting crypto data fetch...');

    // Fetch latest cryptocurrency data from CoinMarketCap
    const response = await fetch(
      'https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest?limit=100',
      {
        headers: {
          'X-CMC_PRO_API_KEY': coinMarketCapApiKey!,
          'Accept': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`CoinMarketCap API error: ${response.status}`);
    }

    const data = await response.json();
    console.log(`Fetched ${data.data.length} cryptocurrencies`);

    // Process and upsert crypto data
    const processedAssets = data.data.map((crypto: any) => ({
      symbol: crypto.symbol,
      name: crypto.name,
      asset_type: 'crypto',
      description: `Market Cap Rank: #${crypto.cmc_rank}`,
      current_price: crypto.quote.USD.price,
      market_cap: crypto.quote.USD.market_cap,
      volume_24h: crypto.quote.USD.volume_24h,
      price_change_24h: crypto.quote.USD.percent_change_24h,
      last_updated: new Date().toISOString()
    }));

    // Batch upsert assets
    const { error: upsertError } = await supabase
      .from('assets')
      .upsert(processedAssets, { 
        onConflict: 'symbol',
        ignoreDuplicates: false 
      });

    if (upsertError) {
      console.error('Error upserting assets:', upsertError);
      throw upsertError;
    }

    console.log('Successfully updated crypto assets');

    // Fetch whitepapers for new cryptos (limit to top 20 for cost efficiency)
    const topCryptos = data.data.slice(0, 20);
    let whitepapersProcessed = 0;

    for (const crypto of topCryptos) {
      try {
        // Check if we already have whitepaper content
        const { data: existingAsset } = await supabase
          .from('assets')
          .select('whitepaper_content')
          .eq('symbol', crypto.symbol)
          .single();

        if (!existingAsset?.whitepaper_content) {
          // Attempt to find and fetch whitepaper
          const whitepaperUrl = await findWhitepaperUrl(crypto.name, crypto.symbol);
          
          if (whitepaperUrl) {
            const whitepaperContent = await fetchWhitepaperContent(whitepaperUrl);
            
            if (whitepaperContent) {
              await supabase
                .from('assets')
                .update({
                  whitepaper_url: whitepaperUrl,
                  whitepaper_content: whitepaperContent
                })
                .eq('symbol', crypto.symbol);
              
              whitepapersProcessed++;
            }
          }
        }
      } catch (error) {
        console.error(`Error processing whitepaper for ${crypto.symbol}:`, error);
        // Continue with next crypto
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        processed_assets: processedAssets.length,
        whitepapers_processed: whitepapersProcessed,
        message: 'Crypto data successfully updated'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Crypto data fetcher error:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Failed to fetch crypto data',
        details: error.message 
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});

async function findWhitepaperUrl(name: string, symbol: string): Promise<string | null> {
  try {
    // Common whitepaper naming patterns
    const searchQueries = [
      `${name} whitepaper filetype:pdf`,
      `${symbol} cryptocurrency whitepaper`,
      `${name} ${symbol} technical paper`
    ];

    // This is a simplified implementation
    // In production, you might want to use a more sophisticated approach
    // or maintain a curated database of whitepaper URLs
    
    return null; // Placeholder - implement actual search logic
  } catch (error) {
    console.error('Error finding whitepaper URL:', error);
    return null;
  }
}

async function fetchWhitepaperContent(url: string): Promise<string | null> {
  try {
    // This would typically involve PDF parsing
    // For now, we'll return a placeholder
    // In production, use a PDF parsing service or library
    
    const response = await fetch(url);
    if (response.ok) {
      // Return URL for now, implement PDF text extraction later
      return `Whitepaper available at: ${url}`;
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching whitepaper content:', error);
    return null;
  }
}