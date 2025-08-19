import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { portfolio_id, user_id } = await req.json();
    
    console.log('Analyzing portfolio:', portfolio_id);

    // Get portfolio details
    const { data: portfolio, error: portfolioError } = await supabase
      .from('portfolios')
      .select('*')
      .eq('id', portfolio_id)
      .eq('user_id', user_id)
      .single();

    if (portfolioError || !portfolio) {
      throw new Error('Portfolio not found or access denied');
    }

    // Get portfolio assets with current prices and compliance
    const { data: portfolioAssets, error: assetsError } = await supabase
      .from('portfolio_assets')
      .select(`
        *,
        assets!inner (
          id,
          symbol,
          name,
          asset_type,
          current_price,
          price_change_24h,
          asset_compliance (
            compliance_status,
            compliance_score,
            compliance_reasons
          )
        )
      `)
      .eq('portfolio_id', portfolio_id);

    if (assetsError) {
      throw assetsError;
    }

    // Calculate portfolio metrics
    const analysis = await calculatePortfolioAnalysis(portfolioAssets || []);
    
    // Update portfolio total value
    const { error: updateError } = await supabase
      .from('portfolios')
      .update({
        total_value: analysis.totalValue,
        updated_at: new Date().toISOString()
      })
      .eq('id', portfolio_id);

    if (updateError) {
      console.error('Error updating portfolio value:', updateError);
    }

    // Log audit event
    await supabase.from('audit_logs').insert({
      user_id,
      action: 'update',
      resource_type: 'portfolio',
      resource_id: portfolio_id,
      metadata: {
        total_value: analysis.totalValue,
        halal_percentage: analysis.complianceBreakdown.halal_percentage
      }
    });

    return new Response(
      JSON.stringify({
        portfolio_id,
        portfolio_name: portfolio.name,
        analysis,
        analyzed_at: new Date().toISOString()
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Portfolio analyzer error:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Failed to analyze portfolio',
        details: error.message 
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});

async function calculatePortfolioAnalysis(portfolioAssets: any[]) {
  let totalValue = 0;
  let totalInvested = 0;
  let halalValue = 0;
  let haramValue = 0;
  let doubtfulValue = 0;
  let pendingValue = 0;

  const assetBreakdown = portfolioAssets.map(portfolioAsset => {
    const asset = portfolioAsset.assets;
    const currentValue = portfolioAsset.quantity * (asset.current_price || 0);
    const investedValue = portfolioAsset.quantity * portfolioAsset.average_price;
    const profitLoss = currentValue - investedValue;
    const profitLossPercentage = investedValue > 0 ? (profitLoss / investedValue) * 100 : 0;

    totalValue += currentValue;
    totalInvested += investedValue;

    // Categorize by compliance status
    const complianceStatus = asset.asset_compliance?.[0]?.compliance_status || 'pending_review';
    
    switch (complianceStatus) {
      case 'halal':
        halalValue += currentValue;
        break;
      case 'haram':
        haramValue += currentValue;
        break;
      case 'doubtful':
        doubtfulValue += currentValue;
        break;
      default:
        pendingValue += currentValue;
    }

    return {
      asset_id: asset.id,
      symbol: asset.symbol,
      name: asset.name,
      asset_type: asset.asset_type,
      quantity: portfolioAsset.quantity,
      average_price: portfolioAsset.average_price,
      current_price: asset.current_price,
      current_value: currentValue,
      invested_value: investedValue,
      profit_loss: profitLoss,
      profit_loss_percentage: profitLossPercentage,
      price_change_24h: asset.price_change_24h,
      compliance_status: complianceStatus,
      compliance_score: asset.asset_compliance?.[0]?.compliance_score,
      compliance_reasons: asset.asset_compliance?.[0]?.compliance_reasons || []
    };
  });

  const totalProfitLoss = totalValue - totalInvested;
  const totalProfitLossPercentage = totalInvested > 0 ? (totalProfitLoss / totalInvested) * 100 : 0;

  const complianceBreakdown = {
    halal_value: halalValue,
    halal_percentage: totalValue > 0 ? (halalValue / totalValue) * 100 : 0,
    haram_value: haramValue,
    haram_percentage: totalValue > 0 ? (haramValue / totalValue) * 100 : 0,
    doubtful_value: doubtfulValue,
    doubtful_percentage: totalValue > 0 ? (doubtfulValue / totalValue) * 100 : 0,
    pending_value: pendingValue,
    pending_percentage: totalValue > 0 ? (pendingValue / totalValue) * 100 : 0
  };

  // Calculate diversification metrics
  const assetTypeBreakdown = assetBreakdown.reduce((acc: any, asset) => {
    acc[asset.asset_type] = (acc[asset.asset_type] || 0) + asset.current_value;
    return acc;
  }, {});

  const diversificationScore = calculateDiversificationScore(assetTypeBreakdown, totalValue);

  // Risk assessment
  const riskAssessment = assessPortfolioRisk(assetBreakdown, complianceBreakdown);

  return {
    totalValue,
    totalInvested,
    totalProfitLoss,
    totalProfitLossPercentage,
    assetBreakdown,
    complianceBreakdown,
    assetTypeBreakdown,
    diversificationScore,
    riskAssessment,
    recommendations: generateRecommendations(complianceBreakdown, diversificationScore, riskAssessment)
  };
}

function calculateDiversificationScore(assetTypeBreakdown: any, totalValue: number): number {
  if (totalValue === 0) return 0;

  const typePercentages = Object.values(assetTypeBreakdown).map((value: any) => value / totalValue);
  
  // Calculate Herfindahl-Hirschman Index (HHI) for diversification
  const hhi = typePercentages.reduce((sum: number, percentage: number) => sum + (percentage * percentage), 0);
  
  // Convert to diversification score (0-100, higher is more diversified)
  return Math.max(0, (1 - hhi) * 100);
}

function assessPortfolioRisk(assetBreakdown: any[], complianceBreakdown: any): string {
  const haramPercentage = complianceBreakdown.haram_percentage;
  const doubtfulPercentage = complianceBreakdown.doubtful_percentage;
  
  const totalNonCompliant = haramPercentage + doubtfulPercentage;
  
  if (totalNonCompliant > 30) return 'high';
  if (totalNonCompliant > 10) return 'medium';
  return 'low';
}

function generateRecommendations(complianceBreakdown: any, diversificationScore: number, riskAssessment: string): string[] {
  const recommendations: string[] = [];

  if (complianceBreakdown.haram_percentage > 5) {
    recommendations.push('Consider divesting from Haram assets to maintain Sharia compliance');
  }

  if (complianceBreakdown.doubtful_percentage > 15) {
    recommendations.push('Review doubtful assets and seek scholarly guidance');
  }

  if (complianceBreakdown.pending_percentage > 20) {
    recommendations.push('Complete compliance review for pending assets');
  }

  if (diversificationScore < 30) {
    recommendations.push('Consider diversifying across more asset types to reduce risk');
  }

  if (riskAssessment === 'high') {
    recommendations.push('High risk portfolio - consider rebalancing towards more compliant assets');
  }

  if (complianceBreakdown.halal_percentage > 80) {
    recommendations.push('Excellent Sharia compliance! Consider expanding within halal assets');
  }

  return recommendations;
}