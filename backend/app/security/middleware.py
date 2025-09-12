# Enterprise-grade security middleware
from fastapi import FastAPI, Request, Response
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.middleware.sessions import SessionMiddleware
import time
import secrets
from typing import Callable
from app.config import settings
import structlog

logger = structlog.get_logger()

class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    """
    Add comprehensive security headers to all responses
    """
    
    async def dispatch(self, request: Request, call_next: Callable) -> Response:
        response = await call_next(request)
        
        # Security Headers - OWASP Recommended
        security_headers = {
            # Prevent XSS attacks
            "X-XSS-Protection": "1; mode=block",
            
            # Prevent MIME type sniffing
            "X-Content-Type-Options": "nosniff",
            
            # Prevent clickjacking
            "X-Frame-Options": "DENY",
            
            # Force HTTPS (HSTS)
            "Strict-Transport-Security": f"max-age={settings.security_hsts_max_age}; includeSubDomains; preload",
            
            # Content Security Policy
            "Content-Security-Policy": (
                "default-src 'self'; "
                "script-src 'self' 'unsafe-inline'; "
                "style-src 'self' 'unsafe-inline'; "
                "img-src 'self' data: https:; "
                "font-src 'self'; "
                "connect-src 'self'; "
                "frame-ancestors 'none';"
            ),
            
            # Referrer Policy
            "Referrer-Policy": "strict-origin-when-cross-origin",
            
            # Permissions Policy (Feature Policy)
            "Permissions-Policy": (
                "geolocation=(), "
                "microphone=(), "
                "camera=(), "
                "payment=(), "
                "usb=(), "
                "magnetometer=(), "
                "accelerometer=(), "
                "gyroscope=()"
            ),
            
            # Remove server information
            "Server": "Nisab-Wisdom-AI",
            
            # Cache control for sensitive endpoints
            "Cache-Control": "no-store, no-cache, must-revalidate, private",
            "Pragma": "no-cache",
            "Expires": "0"
        }
        
        # Apply security headers
        for header, value in security_headers.items():
            response.headers[header] = value
        
        return response

class RequestLoggingMiddleware(BaseHTTPMiddleware):
    """
    Log all requests for security monitoring
    """
    
    async def dispatch(self, request: Request, call_next: Callable) -> Response:
        start_time = time.time()
        
        # Extract client information
        client_ip = request.client.host if request.client else "unknown"
        user_agent = request.headers.get("user-agent", "unknown")
        
        # Log request
        logger.info(
            "Request started",
            method=request.method,
            url=str(request.url),
            client_ip=client_ip,
            user_agent=user_agent
        )
        
        # Process request
        response = await call_next(request)
        
        # Calculate processing time
        process_time = time.time() - start_time
        
        # Log response
        logger.info(
            "Request completed",
            method=request.method,
            url=str(request.url),
            status_code=response.status_code,
            process_time=f"{process_time:.4f}s",
            client_ip=client_ip
        )
        
        # Add processing time header
        response.headers["X-Process-Time"] = str(process_time)
        
        return response

class RateLimitingMiddleware(BaseHTTPMiddleware):
    """
    Basic rate limiting middleware (use Redis in production)
    """
    
    def __init__(self, app, calls: int = 60, period: int = 60):
        super().__init__(app)
        self.calls = calls
        self.period = period
        self.requests = {}  # In production, use Redis
    
    async def dispatch(self, request: Request, call_next: Callable) -> Response:
        client_ip = request.client.host if request.client else "unknown"
        current_time = time.time()
        
        # Clean old entries
        self.requests = {
            ip: timestamps for ip, timestamps in self.requests.items()
            if any(t > current_time - self.period for t in timestamps)
        }
        
        # Check rate limit
        if client_ip in self.requests:
            # Filter recent requests
            recent_requests = [
                t for t in self.requests[client_ip] 
                if t > current_time - self.period
            ]
            
            if len(recent_requests) >= self.calls:
                logger.warning(
                    "Rate limit exceeded",
                    client_ip=client_ip,
                    requests_count=len(recent_requests)
                )
                return Response(
                    content="Rate limit exceeded",
                    status_code=429,
                    headers={"Retry-After": str(self.period)}
                )
            
            self.requests[client_ip] = recent_requests + [current_time]
        else:
            self.requests[client_ip] = [current_time]
        
        response = await call_next(request)
        return response

def setup_security_middleware(app: FastAPI) -> None:
    """
    Configure all security middleware for the FastAPI app
    """
    
    # 1. Trusted Host Middleware (prevents Host header attacks)
    allowed_hosts = ["*"] if settings.environment == "development" else [
        "yourdomain.com", 
        "api.yourdomain.com",
        "localhost"
    ]
    app.add_middleware(TrustedHostMiddleware, allowed_hosts=allowed_hosts)
    
    # 2. CORS Middleware - STRICT configuration
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.allowed_origins,  # NEVER use ["*"] in production
        allow_credentials=True,  # Allow cookies/auth headers
        allow_methods=settings.allowed_methods,
        allow_headers=settings.allowed_headers,
        expose_headers=["X-Process-Time"],  # Headers that frontend can access
        max_age=600,  # Cache preflight requests for 10 minutes
    )
    
    # 3. Security Headers Middleware
    app.add_middleware(SecurityHeadersMiddleware)
    
    # 4. Request Logging Middleware
    app.add_middleware(RequestLoggingMiddleware)
    
    # 5. Rate Limiting Middleware
    app.add_middleware(
        RateLimitingMiddleware,
        calls=settings.rate_limit_requests_per_minute,
        period=60
    )
    
    # 6. Session Middleware (for CSRF protection if needed)
    app.add_middleware(
        SessionMiddleware,
        secret_key=settings.secret_key,
        max_age=1800,  # 30 minutes
        same_site="lax",
        https_only=settings.environment == "production"
    )
    
    logger.info("Security middleware configured", environment=settings.environment)

# CORS Configuration for different environments
def get_cors_config():
    """Get environment-specific CORS configuration"""
    
    if settings.environment == "production":
        return {
            "allow_origins": settings.allowed_origins,  # Explicit domains only
            "allow_credentials": True,
            "allow_methods": ["GET", "POST", "PUT", "DELETE"],
            "allow_headers": [
                "Authorization",
                "Content-Type",
                "X-Requested-With",
                "X-API-Key"
            ],
        }
    elif settings.environment == "staging":
        return {
            "allow_origins": [
                "https://staging.yourdomain.com",
                "http://localhost:3000"
            ],
            "allow_credentials": True,
            "allow_methods": ["*"],
            "allow_headers": ["*"],
        }
    else:  # development
        return {
            "allow_origins": [
                "http://localhost:3000",
                "http://localhost:3001",
                "http://localhost:8080",
                "http://127.0.0.1:3000"
            ],
            "allow_credentials": True,
            "allow_methods": ["*"],
            "allow_headers": ["*"],
        }

# Export functions
__all__ = [
    "setup_security_middleware",
    "SecurityHeadersMiddleware",
    "RequestLoggingMiddleware", 
    "RateLimitingMiddleware",
    "get_cors_config"
]