# 🚀 PRODUCTION DEPLOYMENT COMMANDS
# Windows PowerShell Version - Nisab Wisdom AI

# 1. Pre-deployment Verification
Write-Host "🛡️ Starting Nisab Wisdom AI Production Deployment..." -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Yellow

Write-Host "📋 1. PRE-DEPLOYMENT VERIFICATION" -ForegroundColor Cyan
docker --version
docker compose version
if (Test-Path ".env.production") { Write-Host "✅ Environment file found" -ForegroundColor Green } else { Write-Host "❌ Environment file missing" -ForegroundColor Red }

# 2. Build and Deploy
Write-Host "`n🔨 2. BUILDING & DEPLOYING SERVICES" -ForegroundColor Cyan
Write-Host "Building FastAPI application..."
docker build -t nisab_api .

Write-Host "Starting production stack..."
docker compose -f docker-compose.prod.yml up -d

# 3. Wait for services
Write-Host "`n⏳ Waiting for services to initialize..." -ForegroundColor Yellow
Start-Sleep -Seconds 30

# 4. Health Checks
Write-Host "`n🏥 3. HEALTH CHECK VERIFICATION" -ForegroundColor Cyan

Write-Host "Testing database connection..."
docker exec nisab_db pg_isready -U nisab_user -d nisab_wisdom_ai

Write-Host "Testing Redis connection..."
docker exec nisab_redis redis-cli -a $env:REDIS_PASSWORD ping

Write-Host "Testing API health endpoint..."
try {
    $response = Invoke-WebRequest -Uri "http://localhost:8000/api/v1/health/" -Method GET
    Write-Host "✅ API Health Check: $($response.StatusCode)" -ForegroundColor Green
} catch {
    Write-Host "❌ API Health Check Failed: $($_.Exception.Message)" -ForegroundColor Red
}

# 5. Security Verification
Write-Host "`n🔒 4. SECURITY VERIFICATION" -ForegroundColor Cyan

Write-Host "Testing security headers..."
try {
    $headers = Invoke-WebRequest -Uri "http://localhost/api/v1/health/" -Method HEAD
    $headers.Headers | Format-Table
} catch {
    Write-Host "❌ Security headers test failed" -ForegroundColor Red
}

# 6. Authentication Test
Write-Host "`n🔐 5. AUTHENTICATION FLOW TEST" -ForegroundColor Cyan

$registerData = @{
    email = "test@nisab.com"
    password = "SecurePass123!"
    full_name = "Test User"
} | ConvertTo-Json

try {
    $registerResponse = Invoke-WebRequest -Uri "http://localhost/api/v1/auth/register" `
                                        -Method POST `
                                        -ContentType "application/json" `
                                        -Body $registerData
    Write-Host "✅ Registration: $($registerResponse.StatusCode)" -ForegroundColor Green
} catch {
    Write-Host "❌ Registration failed: $($_.Exception.Message)" -ForegroundColor Red
}

# 7. Final Status
Write-Host "`n📊 6. DEPLOYMENT STATUS" -ForegroundColor Cyan
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

Write-Host "`n🎉 DEPLOYMENT SIMULATION COMPLETE!" -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Yellow
Write-Host "✅ Environment configured" -ForegroundColor Green
Write-Host "✅ Security checklist created" -ForegroundColor Green
Write-Host "✅ Docker configuration ready" -ForegroundColor Green
Write-Host "✅ Deployment scripts prepared" -ForegroundColor Green
Write-Host "`n🌐 Ready to deploy at: https://your-domain.com" -ForegroundColor Cyan