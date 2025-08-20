-- Create function for knowledge base vector search
CREATE OR REPLACE FUNCTION search_knowledge_base(
  query_embedding VECTOR(1536),
  match_threshold FLOAT DEFAULT 0.8,
  match_count INT DEFAULT 5
)
RETURNS TABLE (
  id UUID,
  title TEXT,
  content TEXT,
  source TEXT,
  source_reference TEXT,
  category TEXT,
  similarity FLOAT
)
LANGUAGE SQL
STABLE
SET search_path = public
AS $$
  SELECT
    kb.id,
    kb.title,
    kb.content,
    kb.source,
    kb.source_reference,
    kb.category,
    1 - (kb.embedding <=> query_embedding) AS similarity
  FROM knowledge_base kb
  WHERE 
    kb.is_verified = true
    AND 1 - (kb.embedding <=> query_embedding) > match_threshold
  ORDER BY kb.embedding <=> query_embedding
  LIMIT match_count;
$$;

-- Insert some initial compliance rules (using INSERT with WHERE NOT EXISTS)
INSERT INTO public.compliance_rules (rule_name, rule_category, rule_description, rule_source, rule_criteria)
SELECT 'Prohibition of Riba (Interest)', 'riba_prohibition', 'Islam strictly prohibits any form of interest (riba) in financial transactions', 'Quran 2:275', '{"prohibits": ["interest", "usury", "predetermined_returns"]}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM public.compliance_rules WHERE rule_name = 'Prohibition of Riba (Interest)');

INSERT INTO public.compliance_rules (rule_name, rule_category, rule_description, rule_source, rule_criteria)
SELECT 'Prohibition of Gharar (Excessive Uncertainty)', 'gharar_prohibition', 'Transactions involving excessive uncertainty or speculation are prohibited', 'Islamic Jurisprudence', '{"prohibits": ["gambling", "excessive_speculation", "undefined_terms"]}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM public.compliance_rules WHERE rule_name = 'Prohibition of Gharar (Excessive Uncertainty)');

INSERT INTO public.compliance_rules (rule_name, rule_category, rule_description, rule_source, rule_criteria)
SELECT 'Prohibition of Haram Sectors', 'haram_sectors', 'Investment in sectors prohibited by Islamic law is not allowed', 'Islamic Jurisprudence', '{"prohibited_sectors": ["alcohol", "gambling", "tobacco", "weapons", "adult_entertainment"]}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM public.compliance_rules WHERE rule_name = 'Prohibition of Haram Sectors');

INSERT INTO public.compliance_rules (rule_name, rule_category, rule_description, rule_source, rule_criteria)
SELECT 'Asset-Backed Requirement', 'asset_backing', 'Financial instruments should be backed by real assets as per AAOIFI standards', 'AAOIFI Standard 17', '{"requires": ["tangible_assets", "real_economic_activity"]}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM public.compliance_rules WHERE rule_name = 'Asset-Backed Requirement');

INSERT INTO public.compliance_rules (rule_name, rule_category, rule_description, rule_source, rule_criteria)
SELECT 'Profit and Loss Sharing', 'profit_loss_sharing', 'Investment should involve genuine profit and loss sharing', 'AAOIFI Standards', '{"requires": ["shared_risk", "shared_returns"]}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM public.compliance_rules WHERE rule_name = 'Profit and Loss Sharing');

-- Insert initial knowledge base entries
INSERT INTO public.knowledge_base (title, content, source, source_reference, category, keywords, is_verified)
SELECT 'Prohibition of Riba in the Quran', 'Those who consume interest cannot stand [on the Day of Resurrection] except as one stands who is being beaten by Satan into insanity. That is because they say, "Trade is [just] like interest." But Allah has permitted trade and has forbidden interest.', 'Quran', '2:275', 'riba', ARRAY['riba', 'interest', 'prohibition', 'trade'], true
WHERE NOT EXISTS (SELECT 1 FROM public.knowledge_base WHERE title = 'Prohibition of Riba in the Quran');

INSERT INTO public.knowledge_base (title, content, source, source_reference, category, keywords, is_verified)
SELECT 'AAOIFI Definition of Islamic Finance', 'Islamic finance is a system of banking and finance that complies with Islamic law (Sharia) and its practical application through the development of Islamic economics. The core principles include prohibition of riba (interest), gharar (uncertainty), and haram (forbidden) activities.', 'AAOIFI', 'Standard 1', 'principles', ARRAY['aaoifi', 'islamic_finance', 'principles', 'sharia'], true
WHERE NOT EXISTS (SELECT 1 FROM public.knowledge_base WHERE title = 'AAOIFI Definition of Islamic Finance');

INSERT INTO public.knowledge_base (title, content, source, source_reference, category, keywords, is_verified)
SELECT 'Halal Investment Principles', 'Halal investment must avoid: 1) Interest-based transactions 2) Gambling and speculation 3) Prohibited industries (alcohol, gambling, etc.) 4) Excessive debt companies 5) Companies with non-compliant financial ratios', 'Islamic Finance Scholars', 'Contemporary Fiqh', 'investment', ARRAY['halal', 'investment', 'screening', 'criteria'], true
WHERE NOT EXISTS (SELECT 1 FROM public.knowledge_base WHERE title = 'Halal Investment Principles');

INSERT INTO public.knowledge_base (title, content, source, source_reference, category, keywords, is_verified)
SELECT 'Cryptocurrency from Islamic Perspective', 'Cryptocurrency legitimacy depends on: 1) Absence of interest-based mechanisms 2) Real utility and value 3) No excessive speculation 4) Compliance with money principles in Islam 5) Avoiding prohibited activities', 'Islamic Finance Research', 'Modern Fiqh', 'cryptocurrency', ARRAY['cryptocurrency', 'digital_currency', 'blockchain', 'fiqh'], true
WHERE NOT EXISTS (SELECT 1 FROM public.knowledge_base WHERE title = 'Cryptocurrency from Islamic Perspective');