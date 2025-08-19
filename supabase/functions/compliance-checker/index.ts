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
    const { asset_id, user_id } = await req.json();
    
    console.log('Starting compliance check for asset:', asset_id);

    // Get asset details
    const { data: asset, error: assetError } = await supabase
      .from('assets')
      .select('*')
      .eq('id', asset_id)
      .single();

    if (assetError || !asset) {
      throw new Error('Asset not found');
    }

    // Get active compliance rules
    const { data: complianceRules, error: rulesError } = await supabase
      .from('compliance_rules')
      .select('*')
      .eq('is_active', true);

    if (rulesError) {
      console.error('Error fetching compliance rules:', rulesError);
      throw rulesError;
    }

    // Perform automated compliance checks
    const complianceResults = await performAutomatedChecks(asset, complianceRules || []);
    
    // Use AI for advanced compliance analysis
    const aiAnalysis = await performAIComplianceAnalysis(asset);
    
    // Combine results
    const finalScore = calculateComplianceScore(complianceResults, aiAnalysis);
    const complianceStatus = determineComplianceStatus(finalScore);
    const reasons = [...complianceResults.reasons, ...aiAnalysis.reasons];

    // Update asset compliance
    const { error: updateError } = await supabase
      .from('asset_compliance')
      .upsert({
        asset_id,
        compliance_status: complianceStatus,
        compliance_score: finalScore,
        compliance_reasons: reasons,
        last_checked: new Date().toISOString(),
        checked_by: user_id,
        automated_check: true
      }, { onConflict: 'asset_id' });

    if (updateError) {
      console.error('Error updating compliance:', updateError);
      throw updateError;
    }

    // Log audit event
    if (user_id) {
      await supabase.from('audit_logs').insert({
        user_id,
        action: 'compliance_check',
        resource_type: 'asset',
        resource_id: asset_id,
        metadata: {
          compliance_status: complianceStatus,
          compliance_score: finalScore
        }
      });
    }

    console.log(`Compliance check completed for ${asset.symbol}: ${complianceStatus}`);

    return new Response(
      JSON.stringify({
        asset_id,
        symbol: asset.symbol,
        compliance_status: complianceStatus,
        compliance_score: finalScore,
        reasons,
        checked_at: new Date().toISOString()
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Compliance checker error:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Failed to check compliance',
        details: error.message 
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});

async function performAutomatedChecks(asset: any, rules: any[]): Promise<{ score: number; reasons: string[] }> {
  const reasons: string[] = [];
  let positivePoints = 0;
  let negativePoints = 0;
  let totalChecks = 0;

  for (const rule of rules) {
    totalChecks++;
    
    try {
      const criteria = rule.rule_criteria || {};
      
      // Example automated checks based on AAOIFI standards
      switch (rule.rule_category) {
        case 'riba_prohibition':
          if (asset.asset_type === 'crypto') {
            // Check if crypto involves interest-based mechanics
            if (asset.description?.toLowerCase().includes('lending') || 
                asset.description?.toLowerCase().includes('staking rewards')) {
              negativePoints++;
              reasons.push(`${rule.rule_name}: Asset may involve interest-based mechanisms`);
            } else {
              positivePoints++;
              reasons.push(`${rule.rule_name}: No clear interest-based mechanisms detected`);
            }
          }
          break;
          
        case 'gharar_prohibition':
          if (asset.asset_type === 'crypto') {
            // Check for excessive uncertainty
            if (asset.name?.toLowerCase().includes('meme') || 
                asset.name?.toLowerCase().includes('random')) {
              negativePoints++;
              reasons.push(`${rule.rule_name}: Asset may involve excessive uncertainty (gharar)`);
            } else {
              positivePoints++;
              reasons.push(`${rule.rule_name}: Acceptable level of uncertainty`);
            }
          }
          break;
          
        case 'haram_sectors':
          // Check if asset is related to prohibited sectors
          const prohibitedKeywords = ['gambling', 'alcohol', 'tobacco', 'weapons', 'adult'];
          const isProhibited = prohibitedKeywords.some(keyword => 
            asset.name?.toLowerCase().includes(keyword) || 
            asset.description?.toLowerCase().includes(keyword)
          );
          
          if (isProhibited) {
            negativePoints++;
            reasons.push(`${rule.rule_name}: Asset may be related to prohibited sectors`);
          } else {
            positivePoints++;
            reasons.push(`${rule.rule_name}: Asset not related to prohibited sectors`);
          }
          break;
      }
    } catch (error) {
      console.error(`Error applying rule ${rule.rule_name}:`, error);
    }
  }

  const score = totalChecks > 0 ? (positivePoints / totalChecks) : 0.5;
  return { score, reasons };
}

async function performAIComplianceAnalysis(asset: any): Promise<{ score: number; reasons: string[] }> {
  try {
    const prompt = `As an Islamic finance expert, analyze the following asset for Sharia compliance:

Asset: ${asset.name} (${asset.symbol})
Type: ${asset.asset_type}
Description: ${asset.description || 'No description available'}
Whitepaper Content: ${asset.whitepaper_content || 'No whitepaper available'}

Evaluate based on:
1. Riba (Interest) prohibition
2. Gharar (Excessive uncertainty) prohibition  
3. Haram sector involvement
4. AAOIFI standards for Islamic financial institutions
5. Modern Islamic finance principles

Provide:
1. Compliance status (halal/haram/doubtful)
2. Confidence score (0-1)
3. Specific reasons for the assessment
4. Recommendations if doubtful

Format your response as JSON:
{
  "status": "halal|haram|doubtful",
  "score": 0.0-1.0,
  "reasons": ["reason1", "reason2"],
  "recommendations": ["rec1", "rec2"]
}`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4-turbo-preview',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 800,
        temperature: 0.1,
      }),
    });

    const data = await response.json();
    const analysis = JSON.parse(data.choices[0].message.content);
    
    return {
      score: analysis.score,
      reasons: analysis.reasons || []
    };
    
  } catch (error) {
    console.error('AI compliance analysis error:', error);
    return {
      score: 0.5,
      reasons: ['AI analysis unavailable - manual review recommended']
    };
  }
}

function calculateComplianceScore(automatedResults: any, aiResults: any): number {
  // Weight: 60% automated rules, 40% AI analysis
  return (automatedResults.score * 0.6) + (aiResults.score * 0.4);
}

function determineComplianceStatus(score: number): string {
  if (score >= 0.8) return 'halal';
  if (score <= 0.3) return 'haram';
  return 'doubtful';
}