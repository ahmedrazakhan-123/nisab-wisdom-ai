# Nisab Backend Verification Guide

Complete acceptance test suite to validate the Nisab Islamic finance platform backend meets all 15 production requirements.

## Quick Start

```bash
# 1. Install dependencies
npm install -g newman k6
deno install

# 2. Set environment variables
export SUPABASE_URL="https://rsugotioapwxuelehsml.supabase.co"
export SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJzdWdvdGlvYXB3eHVlbGVoc21sIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU1Nzg0OTQsImV4cCI6MjA3MTE1NDQ5NH0._qoXGjLk2SWpoV-VnTKkTicZiOEEs84HZ5QFrTiSAWU"

# 3. Run all tests
./run-all-tests.sh
```

## Individual Test Commands

### 1. Functions Deployment Check
```bash
# Check if all functions are deployed
supabase functions list
# Expected: islamic-chatbot, compliance-checker, portfolio-analyzer, crypto-data-fetcher, news-sentiment-analyzer
```

### 2. Database Verification
```bash
# Run SQL verification script
psql "$SUPABASE_URL" -f sql/verify.sql
```

### 3. Seed Test Data
```bash
# Populate database with test data
psql "$SUPABASE_URL" -f scripts/seed.sql
```

### 4. Unit Tests
```bash
# Run Deno unit tests
deno test functions/tests/zakat.test.ts --allow-net
deno test functions/tests/chatbot.test.ts --allow-net
```

### 5. API Integration Tests
```bash
# Run Postman collection
newman run tests/postman/Nisab.postman_collection.json \
  --env-var "SUPABASE_ANON_KEY=$SUPABASE_ANON_KEY"
```

### 6. Load Testing
```bash
# Run k6 load test
k6 run k6/chatbot_load_test.js
```

## Test Coverage Matrix

| Requirement | Test Method | Pass Criteria |
|-------------|-------------|---------------|
| 1. Functions deployed | `supabase functions list` | All 5 functions listed |
| 2. Env vars exist | Function logs check | No "undefined" errors |
| 3. pgvector enabled | SQL query | `vector_enabled = true` |
| 4. RLS prevents cross-tenant | Postman tests | 403/404 for cross-tenant access |
| 5. Idempotency enforced | Postman tests | Duplicate requests return same response |
| 6. Rate limiting | k6 rapid requests | 429 status after threshold |
| 7. Citations never hallucinate | Unit tests | All responses contain Quran/Hadith/AAOIFI refs |
| 8. RAG quality | Integration tests | Relevant knowledge base chunks retrieved |
| 9. System prompt hygiene | Unit tests | No "I don't know" or fabrication markers |
| 10. Zakat calculator deterministic | Unit tests | Same inputs = same outputs |
| 11. Logs redact secrets | Log inspection | No API keys in error logs |
| 12. Consistent error envelope | API tests | All errors return `{error, details}` |
| 13. p95 < 1500ms SLO | k6 load test | Threshold validation |
| 14. AAOIFI rule IDs | Compliance tests | Explicit Standard references |
| 15. Env vars not hardcoded | Code inspection | No hardcoded API keys |

## Expected Results

### SQL Verification Output
```
=== 1. Extensions and Functions ===
 vector_enabled | search_function_exists 
----------------+------------------------
 t              | t

=== 2. Core Tables ===
 count 
-------
    10

=== 3. RLS Policies Active ===
(Multiple policies listed for each table)

=== 4. Knowledge Base Populated ===
 kb_entries | embeddings_count 
------------+------------------
         3  |                3

=== 7. RLS Cross-Tenant Test ===
 should_be_zero_for_user1 
--------------------------
                        0
```

### Unit Test Output
```
running 8 tests from functions/tests/zakat.test.ts
test Zakat calculation - basic scenarios ... ok
test Nisab threshold calculation ... ok
test Deterministic results ... ok
ok | 8 passed | 0 failed

running 7 tests from functions/tests/chatbot.test.ts  
test Response structure validation ... ok
test Citation requirements ... ok
test Prohibited content detection ... ok
ok | 7 passed | 0 failed
```

### Postman Test Output
```
→ Basic Query with Citations
  ✓ Response has correct structure
  ✓ Response contains citations  
  ✓ Sources array is populated
  ✓ Response time is acceptable

→ Idempotency Verification
  ✓ Idempotent response matches first request

→ Cross-tenant access denied
  ✓ Cross-tenant access denied
```

### k6 Load Test Output
```
✓ http_req_duration..........: avg=892ms   p(95)=1234ms
✓ errors....................: 0.23%
✓ chatbot_response_time......: avg=901ms   p(95)=1456ms

✅ LOAD TEST PASSED - All SLO thresholds met
```

## Troubleshooting

### Common Issues

1. **Functions not deployed**
   ```bash
   # Check function logs
   supabase functions logs islamic-chatbot
   ```

2. **Missing environment variables**
   ```bash
   # Check secrets in Supabase dashboard
   # Navigate to: Settings > Edge Functions > Manage secrets
   ```

3. **RLS policy failures**
   ```bash
   # Check user context in SQL
   SELECT auth.uid(), auth.role();
   ```

4. **Load test timeouts**
   ```bash
   # Check function cold start times
   # Consider increasing thresholds for initial deployment
   ```

## Manual Verification Steps

### 1. Chatbot Quality Check
```bash
curl -X POST https://rsugotioapwxuelehsml.supabase.co/functions/v1/islamic-chatbot \
  -H "Content-Type: application/json" \
  -H "apikey: $SUPABASE_ANON_KEY" \
  -d '{"query": "Is cryptocurrency halal?", "user_id": "test-user"}'
```

Expected response should:
- Include citations (Quran/Hadith/AAOIFI references)
- Have confidence level (high/medium/low)
- Provide specific guidance (not vague "consult scholar" answers)

### 2. Compliance Checker Verification
```bash
curl -X POST https://rsugotioapwxuelehsml.supabase.co/functions/v1/compliance-checker \
  -H "Content-Type: application/json" \
  -H "apikey: $SUPABASE_ANON_KEY" \
  -d '{"asset_id": "cccccccc-cccc-cccc-cccc-cccccccccccc", "user_id": "test-user"}'
```

Expected response should:
- Return status: halal/haram/doubtful
- Include AAOIFI Standard references
- Provide specific compliance reasons

### 3. Portfolio Analysis Check
```bash
curl -X POST https://rsugotioapwxuelehsml.supabase.co/functions/v1/portfolio-analyzer \
  -H "Content-Type: application/json" \
  -H "apikey: $SUPABASE_ANON_KEY" \
  -d '{"portfolio_id": "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa", "user_id": "11111111-1111-1111-1111-111111111111"}'
```

Expected response should:
- Calculate correct zakat (2.5% of wealth above nisab)
- Provide compliance breakdown percentages
- Include actionable recommendations

## Success Criteria

All tests must pass with:
- ✅ 0 failed unit tests
- ✅ 0 failed Postman assertions  
- ✅ k6 thresholds met (p95 < 1500ms, error rate < 1%)
- ✅ SQL verification queries return expected values
- ✅ Cross-tenant isolation verified
- ✅ Idempotency proven
- ✅ Citations present in all chatbot responses
- ✅ No secrets leaked in logs
- ✅ Consistent error response format

## Automation Script

Create `run-all-tests.sh`:
```bash
#!/bin/bash
set -e

echo "🔄 Running Nisab Backend Verification Suite..."

echo "1️⃣ Checking function deployment..."
supabase functions list

echo "2️⃣ Verifying database structure..."
psql "$SUPABASE_URL" -f sql/verify.sql

echo "3️⃣ Seeding test data..."
psql "$SUPABASE_URL" -f scripts/seed.sql

echo "4️⃣ Running unit tests..."
deno test functions/tests/ --allow-net

echo "5️⃣ Running API integration tests..."
newman run tests/postman/Nisab.postman_collection.json \
  --env-var "SUPABASE_ANON_KEY=$SUPABASE_ANON_KEY" \
  --bail

echo "6️⃣ Running load tests..."
k6 run k6/chatbot_load_test.js

echo "✅ All verification tests completed successfully!"
```

```bash
chmod +x run-all-tests.sh
./run-all-tests.sh
```