-- Nisab Test Data Seeding Script
-- Run with: psql -f scripts/seed.sql

-- Clean existing test data
DELETE FROM audit_logs WHERE user_id IN (
  SELECT id FROM profiles WHERE email LIKE '%test%'
);
DELETE FROM zakat_calculations WHERE user_id IN (
  SELECT id FROM profiles WHERE email LIKE '%test%'
);
DELETE FROM portfolio_assets WHERE portfolio_id IN (
  SELECT id FROM portfolios WHERE user_id IN (
    SELECT id FROM profiles WHERE email LIKE '%test%'
  )
);
DELETE FROM portfolios WHERE user_id IN (
  SELECT id FROM profiles WHERE email LIKE '%test%'
);
DELETE FROM user_roles WHERE user_id IN (
  SELECT id FROM profiles WHERE email LIKE '%test%'
);
DELETE FROM profiles WHERE email LIKE '%test%';

-- Insert test users
INSERT INTO profiles (id, email, full_name, country, preferred_currency) VALUES
('11111111-1111-1111-1111-111111111111', 'user1@test.com', 'Test User One', 'UAE', 'USD'),
('22222222-2222-2222-2222-222222222222', 'user2@test.com', 'Test User Two', 'Saudi Arabia', 'SAR');

-- Assign roles
INSERT INTO user_roles (user_id, role) VALUES
('11111111-1111-1111-1111-111111111111', 'standard_user'),
('22222222-2222-2222-2222-222222222222', 'premium_user');

-- Create portfolios
INSERT INTO portfolios (id, user_id, name, description, is_default, total_value) VALUES
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111', 'Test Portfolio 1', 'User 1 default portfolio', true, 50000.00),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '22222222-2222-2222-2222-222222222222', 'Test Portfolio 2', 'User 2 default portfolio', true, 75000.00);

-- Insert test assets
INSERT INTO assets (id, name, symbol, asset_type, current_price, market_cap, description) VALUES
('cccccccc-cccc-cccc-cccc-cccccccccccc', 'Bitcoin', 'BTC', 'cryptocurrency', 45000.00, 900000000000, 'Digital gold'),
('dddddddd-dddd-dddd-dddd-dddddddddddd', 'Ethereum', 'ETH', 'cryptocurrency', 3000.00, 400000000000, 'Smart contract platform'),
('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'Apple Inc', 'AAPL', 'stock', 180.00, 3000000000000, 'Technology company'),
('ffffffff-ffff-ffff-ffff-ffffffffffff', 'Tesla Inc', 'TSLA', 'stock', 250.00, 800000000000, 'Electric vehicle manufacturer');

-- Add assets to portfolios
INSERT INTO portfolio_assets (portfolio_id, asset_id, quantity, average_price, current_value) VALUES
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 1.0, 40000.00, 45000.00),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 25.0, 170.00, 4500.00),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'dddddddd-dddd-dddd-dddd-dddddddddddd', 20.0, 2800.00, 60000.00),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'ffffffff-ffff-ffff-ffff-ffffffffffff', 60.0, 240.00, 15000.00);

-- Add compliance data
INSERT INTO asset_compliance (asset_id, compliance_status, compliance_score, compliance_reasons, automated_check) VALUES
('cccccccc-cccc-cccc-cccc-cccccccccccc', 'doubtful', 65.5, ARRAY['High volatility', 'No underlying asset'], true),
('dddddddd-dddd-dddd-dddd-dddddddddddd', 'doubtful', 70.0, ARRAY['Smart contract risks', 'DeFi exposure'], true),
('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'halal', 85.0, ARRAY['Compliant business model', 'Low debt ratio'], true),
('ffffffff-ffff-ffff-ffff-ffffffffffff', 'halal', 80.0, ARRAY['Innovation in clean energy', 'Ethical business practices'], true);

-- Insert knowledge base entries with embeddings (mock embeddings for testing)
INSERT INTO knowledge_base (id, title, content, source, source_reference, category, is_verified, embedding) VALUES
('kb1111111-1111-1111-1111-111111111111', 'Riba Prohibition', 'Interest (riba) is strictly forbidden in Islamic finance. This includes both giving and receiving interest.', 'Quran', 'Al-Baqarah 2:275', 'riba', true, '[0.1,0.2,0.3]'::vector),
('kb2222222-2222-2222-2222-222222222222', 'Gharar Definition', 'Gharar refers to excessive uncertainty or ambiguity in contracts, which is prohibited in Islamic transactions.', 'AAOIFI', 'Standard 1', 'gharar', true, '[0.4,0.5,0.6]'::vector),
('kb3333333-3333-3333-3333-333333333333', 'Zakat Calculation', 'Zakat is 2.5% of wealth above nisab threshold, calculated annually on savings, gold, silver, and trade goods.', 'Hadith', 'Bukhari 1454', 'zakat', true, '[0.7,0.8,0.9]'::vector);

-- Insert test Zakat calculations
INSERT INTO zakat_calculations (user_id, total_wealth, nisab_threshold, zakat_due, currency, calculation_data) VALUES
('11111111-1111-1111-1111-111111111111', 50000.00, 7500.00, 1250.00, 'USD', 
 '{"cash": 10000, "gold": 15000, "stocks": 25000, "nisab_gold_price": 2000, "nisab_silver_price": 1500}'::jsonb),
('22222222-2222-2222-2222-222222222222', 75000.00, 7500.00, 1875.00, 'USD',
 '{"cash": 25000, "crypto": 30000, "stocks": 20000, "nisab_gold_price": 2000, "nisab_silver_price": 1500}'::jsonb);

-- Insert audit logs
INSERT INTO audit_logs (user_id, action, resource_type, resource_id, metadata) VALUES
('11111111-1111-1111-1111-111111111111', 'create', 'portfolio', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '{"test": true}'::jsonb),
('22222222-2222-2222-2222-222222222222', 'create', 'portfolio', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '{"test": true}'::jsonb);

-- Insert news articles for testing
INSERT INTO news_articles (title, content, source, sentiment_score, sentiment_label, tags, related_assets) VALUES
('Bitcoin Reaches New High', 'Bitcoin price surges to new all-time high amid institutional adoption.', 'CryptoNews', 0.8, 'positive', ARRAY['bitcoin', 'cryptocurrency'], ARRAY['BTC']),
('Islamic Finance Growth', 'Global Islamic finance industry shows continued growth in compliance-focused investments.', 'Islamic Finance Today', 0.9, 'positive', ARRAY['islamic', 'finance', 'growth'], ARRAY['halal']);

COMMIT;

SELECT 'Test data seeded successfully' AS status;