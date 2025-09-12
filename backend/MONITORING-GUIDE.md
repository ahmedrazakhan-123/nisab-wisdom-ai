# 🔍 PRODUCTION MONITORING & SECURITY VERIFICATION GUIDE
# Nisab Wisdom AI - Enterprise Security Validation

## 📊 **REAL-TIME MONITORING COMMANDS**

### **1. Service Health Monitoring**
```bash
# Check all container status
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}\t{{.RunningFor}}"

# Monitor resource usage
docker stats --format "table {{.Container}}\t{{.CPUPerc}}\t{{.MemUsage}}\t{{.NetIO}}\t{{.PIDs}}"

# Check service logs
docker logs nisab_api --tail=50 --follow
docker logs nisab_db --tail=20
docker logs nisab_redis --tail=20
docker logs nisab_nginx --tail=30
```

### **2. API Health Verification**
```bash
# Basic health check
curl -f https://your-domain.com/api/v1/health/

# Detailed health check with metrics
curl -f https://your-domain.com/api/v1/health/detailed | jq '.'

# Database connectivity test
curl -f https://your-domain.com/api/v1/health/db | jq '.'

# Redis connectivity test  
curl -f https://your-domain.com/api/v1/health/redis | jq '.'
```

### **3. Security Headers Validation**
```bash
# Test all security headers
curl -I https://your-domain.com/api/v1/health/ | grep -E "(X-Frame-Options|X-Content-Type-Options|Strict-Transport-Security|X-XSS-Protection|Content-Security-Policy|Referrer-Policy)"

# Expected output:
# Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
# X-Content-Type-Options: nosniff
# X-Frame-Options: DENY
# X-XSS-Protection: 1; mode=block
# Content-Security-Policy: default-src 'self'
# Referrer-Policy: strict-origin-when-cross-origin
```

### **4. CORS Security Testing**
```bash
# Test unauthorized origin (should fail)
curl -H "Origin: https://malicious-site.com" \
     -H "Access-Control-Request-Method: POST" \
     -X OPTIONS https://your-domain.com/api/v1/zakat/calculate
# Expected: No CORS headers or 403 response

# Test authorized origin (should succeed)
curl -H "Origin: https://nisab-wisdom-ai.vercel.app" \
     -H "Access-Control-Request-Method: POST" \
     -X OPTIONS https://your-domain.com/api/v1/zakat/calculate
# Expected: CORS headers present
```

### **5. Rate Limiting Verification**
```bash
# Test authentication rate limiting (should hit limit after 5 attempts)
for i in {1..10}; do
  echo "Attempt $i:"
  curl -X POST https://your-domain.com/api/v1/auth/login \
       -H "Content-Type: application/json" \
       -d '{"email":"test@test.com","password":"wrong"}' \
       -w "Status: %{http_code}, Time: %{time_total}s\n" \
       -o /dev/null -s
  sleep 1
done
# Expected: 401 for attempts 1-5, then 429 (Too Many Requests) for 6-10
```

### **6. Authentication Flow Testing**
```bash
# 1. Register new user
REGISTER_RESPONSE=$(curl -X POST https://your-domain.com/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"monitor@nisab.com","password":"SecureTest123!","full_name":"Monitor User"}' \
  -s)
echo "Registration: $REGISTER_RESPONSE"

# 2. Login and get token
TOKEN=$(curl -X POST https://your-domain.com/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"monitor@nisab.com","password":"SecureTest123!"}' \
  -s | jq -r '.access_token')
echo "Token acquired: ${TOKEN:0:20}..."

# 3. Test protected endpoint
curl -H "Authorization: Bearer $TOKEN" \
     https://your-domain.com/api/v1/zakat/calculate \
     -H "Content-Type: application/json" \
     -d '{"cash_in_hand":50000,"gold_in_grams":200,"silver_in_grams":1000}' \
     -w "Status: %{http_code}\n"

# 4. Test without token (should fail)
curl https://your-domain.com/api/v1/zakat/calculate \
     -H "Content-Type: application/json" \
     -d '{"cash_in_hand":50000}' \
     -w "Status: %{http_code}\n"
# Expected: 401 Unauthorized
```

### **7. Input Validation Testing**
```bash
# Test SQL injection prevention
curl -X POST https://your-domain.com/api/v1/zakat/calculate \
     -H "Authorization: Bearer $TOKEN" \
     -H "Content-Type: application/json" \
     -d '{"cash_in_hand":"1000; DROP TABLE users;--","gold_in_grams":100}' \
     -w "Status: %{http_code}\n"
# Expected: 422 Validation Error

# Test XSS prevention in registration
curl -X POST https://your-domain.com/api/v1/auth/register \
     -H "Content-Type: application/json" \
     -d '{"email":"<script>alert(1)</script>@test.com","password":"Test123!","full_name":"<img src=x onerror=alert(1)>"}' \
     -w "Status: %{http_code}\n"
# Expected: 422 Validation Error

# Test extreme values
curl -X POST https://your-domain.com/api/v1/zakat/calculate \
     -H "Authorization: Bearer $TOKEN" \
     -H "Content-Type: application/json" \
     -d '{"cash_in_hand":999999999999999999999,"gold_in_grams":-100}' \
     -w "Status: %{http_code}\n"
# Expected: 422 Validation Error
```

### **8. SSL/TLS Security Testing**
```bash
# Test SSL configuration
openssl s_client -connect your-domain.com:443 -servername your-domain.com -brief
# Should show TLS 1.2+ and strong cipher

# Test SSL Labs rating (external)
# Visit: https://www.ssllabs.com/ssltest/analyze.html?d=your-domain.com
# Target: A+ rating

# Test HSTS
curl -I https://your-domain.com | grep -i strict-transport-security
# Expected: Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
```

### **9. Database Security Monitoring**
```bash
# Check database connections
docker exec nisab_db psql -U nisab_user -d nisab_wisdom_ai -c "SELECT count(*) FROM pg_stat_activity WHERE state = 'active';"

# Check for suspicious activity
docker exec nisab_db psql -U nisab_user -d nisab_wisdom_ai -c "SELECT query, state, query_start FROM pg_stat_activity WHERE query NOT LIKE '%pg_stat_activity%' ORDER BY query_start DESC LIMIT 10;"

# Verify user privileges
docker exec nisab_db psql -U nisab_user -d nisab_wisdom_ai -c "\du"
# User should NOT have superuser privileges
```

### **10. Redis Security Monitoring**
```bash
# Test Redis authentication
docker exec nisab_redis redis-cli -a $REDIS_PASSWORD ping
# Expected: PONG

# Check Redis info
docker exec nisab_redis redis-cli -a $REDIS_PASSWORD info server | grep -E "(redis_version|os|tcp_port)"

# Monitor Redis connections
docker exec nisab_redis redis-cli -a $REDIS_PASSWORD info clients
```

## 🚨 **CRITICAL ALERTS TO MONITOR**

### **Security Event Alerts**
```bash
# Monitor failed authentication attempts
docker logs nisab_api | grep "authentication.failed" | tail -20

# Monitor rate limiting triggers
docker logs nisab_api | grep "rate.limit.exceeded" | tail -20

# Monitor suspicious SQL patterns
docker logs nisab_api | grep -i "sql.injection.attempt" | tail -10

# Monitor CORS violations
docker logs nisab_nginx | grep "blocked.cors" | tail -10
```

### **Performance Alerts**
```bash
# High CPU usage alert (>80%)
docker stats --no-stream | awk 'NR>1 {gsub(/%/, "", $3); if($3>80) print $2 " CPU: " $3 "%"}'

# High memory usage alert (>80%)
docker stats --no-stream | awk 'NR>1 {split($4, mem, "/"); gsub(/[A-Za-z]/, "", mem[1]); gsub(/[A-Za-z]/, "", mem[2]); if((mem[1]/mem[2])*100>80) print $2 " Memory: " (mem[1]/mem[2])*100 "%"}'

# Database connection pool exhaustion
docker exec nisab_db psql -U nisab_user -d nisab_wisdom_ai -c "SELECT count(*) as active_connections FROM pg_stat_activity WHERE state = 'active';" | tail -1
# Alert if > 18 (90% of max 20)
```

## 📈 **CONTINUOUS MONITORING SETUP**

### **Automated Health Checks**
```bash
# Create monitoring script (run every 5 minutes via cron)
#!/bin/bash
HEALTH_URL="https://your-domain.com/api/v1/health/"
RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" $HEALTH_URL)

if [ $RESPONSE -ne 200 ]; then
    echo "ALERT: Health check failed with status $RESPONSE" | mail -s "Nisab API Alert" admin@your-domain.com
    # Send to Slack/Discord webhook
    curl -X POST -H 'Content-type: application/json' \
         --data '{"text":"🚨 Nisab API Health Check Failed: Status '$RESPONSE'"}' \
         YOUR_SLACK_WEBHOOK_URL
fi
```

### **Log Aggregation**
```bash
# Centralized logging setup
docker logs nisab_api --follow | grep -E "(ERROR|CRITICAL|security|auth)" >> /var/log/nisab/security.log
docker logs nisab_nginx --follow | grep -E "(40[0-9]|50[0-9])" >> /var/log/nisab/errors.log
```

## ✅ **PRODUCTION READINESS CHECKLIST**

- [ ] **All containers running**: `docker ps` shows all services healthy
- [ ] **Health endpoints respond**: All `/health/` endpoints return 200
- [ ] **Security headers present**: HSTS, CSP, X-Frame-Options configured
- [ ] **CORS restrictions active**: Unauthorized origins blocked
- [ ] **Rate limiting functional**: Limits enforced after threshold
- [ ] **Authentication working**: Login/logout/protected endpoints work
- [ ] **Input validation active**: Malicious inputs rejected
- [ ] **SSL/TLS A+ rating**: Strong encryption configured
- [ ] **Database secured**: SSL enabled, minimal privileges
- [ ] **Redis protected**: Authentication required
- [ ] **Monitoring active**: Logs being collected and analyzed
- [ ] **Alerts configured**: Critical events trigger notifications

## 🎯 **SUCCESS METRICS**

**Security KPIs:**
- Zero successful SQL injection attempts
- <1% failed authentication rate
- 100% HTTPS traffic
- <5% rate limiting violations
- A+ SSL Labs rating

**Performance KPIs:**
- <200ms API response time
- >99.9% uptime
- <80% resource utilization
- <10 active database connections
- Zero memory leaks

**Business KPIs:**
- Accurate Zakat calculations
- Real-time gold/silver pricing
- Islamic finance compliance
- User data privacy maintained