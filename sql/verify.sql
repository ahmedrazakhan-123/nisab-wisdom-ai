-- Nisab Backend Verification SQL
-- Run with: psql -f sql/verify.sql

\echo '=== 1. Extensions and Functions ==='
SELECT EXISTS(SELECT 1 FROM pg_extension WHERE extname = 'vector') AS vector_enabled;
SELECT EXISTS(SELECT 1 FROM pg_proc WHERE proname = 'search_knowledge_base') AS search_function_exists;

\echo '=== 2. Core Tables ==='
SELECT count(*) FROM information_schema.tables WHERE table_schema = 'public' AND table_name IN (
  'profiles', 'portfolios', 'assets', 'portfolio_assets', 
  'knowledge_base', 'compliance_rules', 'asset_compliance', 
  'audit_logs', 'zakat_calculations', 'news_articles'
);

\echo '=== 3. RLS Policies Active ==='
SELECT schemaname, tablename, policyname, permissive, cmd 
FROM pg_policies 
WHERE schemaname = 'public' 
ORDER BY tablename, policyname;

\echo '=== 4. Knowledge Base Populated ==='
SELECT count(*) as kb_entries, count(embedding) as embeddings_count 
FROM knowledge_base WHERE is_verified = true;

\echo '=== 5. Compliance Rules Active ==='
SELECT count(*) as active_rules FROM compliance_rules WHERE is_active = true;

\echo '=== 6. Indexes for Performance ==='
SELECT schemaname, tablename, indexname 
FROM pg_indexes 
WHERE schemaname = 'public' 
AND (indexname LIKE '%embedding%' OR indexname LIKE '%user_id%')
ORDER BY tablename;

\echo '=== 7. RLS Cross-Tenant Test ==='
-- This should return 0 rows when run as different users
SET SESSION "request.jwt.claims" = '{"sub": "user1-uuid"}';
SELECT count(*) as should_be_zero_for_user1 FROM portfolios WHERE user_id != 'user1-uuid'::uuid;

SET SESSION "request.jwt.claims" = '{"sub": "user2-uuid"}';  
SELECT count(*) as should_be_zero_for_user2 FROM portfolios WHERE user_id != 'user2-uuid'::uuid;

\echo '=== 8. Audit System ==='
SELECT count(*) as audit_entries FROM audit_logs WHERE created_at > now() - interval '24 hours';

\echo '=== 9. User Roles System ==='
SELECT role, count(*) FROM user_roles GROUP BY role;

\echo '=== Verification Complete ==='