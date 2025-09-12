// Simple Vercel API function for gold/silver prices
// No additional dependencies needed

interface CoinGeckoResponse {
  gold: { usd: number };
  silver: { usd: number };
}

export default async function handler(req: any, res: any) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Fetch gold and silver prices from CoinGecko
    const response = await fetch(
      'https://api.coingecko.com/api/v3/simple/price?ids=gold,silver&vs_currencies=usd',
      {
        headers: {
          'User-Agent': 'Nisab-Wisdom-AI/1.0',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`CoinGecko API error: ${response.status}`);
    }

    const data: CoinGeckoResponse = await response.json();

    // Convert from USD per ounce to USD per gram
    const OUNCES_TO_GRAMS = 31.1035;
    const goldPricePerGram = data.gold?.usd ? data.gold.usd / OUNCES_TO_GRAMS : null;
    const silverPricePerGram = data.silver?.usd ? data.silver.usd / OUNCES_TO_GRAMS : null;

    if (!goldPricePerGram || !silverPricePerGram) {
      throw new Error('Invalid price data received');
    }

    // Return formatted response
    const result = {
      success: true,
      data: {
        gold: Number(goldPricePerGram.toFixed(2)),
        silver: Number(silverPricePerGram.toFixed(4)),
        lastUpdated: new Date().toISOString(),
        source: 'CoinGecko API'
      }
    };

    // Cache for 5 minutes
    res.setHeader('Cache-Control', 'public, s-maxage=300');
    return res.status(200).json(result);

  } catch (error) {
    console.error('Error fetching gold/silver prices:', error);
    
    // Return fallback prices
    const fallbackResult = {
      success: false,
      data: {
        gold: 75.00,  // Fallback gold price per gram
        silver: 0.95, // Fallback silver price per gram
        lastUpdated: new Date().toISOString(),
        source: 'Fallback prices'
      },
      error: 'Live prices unavailable, using fallback values'
    };

    return res.status(200).json(fallbackResult);
  }
}