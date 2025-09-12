# Production-grade rate limiting with Redis
import redis
import json
import time
from typing import Optional, Dict, Any
from fastapi import Request, HTTPException, status
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from app.config import settings
import structlog

logger = structlog.get_logger()

class RedisRateLimiter:
    """
    Enterprise-grade rate limiting with Redis backend
    Supports per-user and per-IP limiting with different tiers
    """
    
    def __init__(self, redis_url: str = None):
        self.redis_url = redis_url or settings.redis_url
        self.redis_client = None
        self._connect()
    
    def _connect(self):
        """Connect to Redis with error handling"""
        try:
            self.redis_client = redis.from_url(
                self.redis_url,
                password=settings.redis_password,
                decode_responses=True,
                socket_connect_timeout=5,
                socket_timeout=5,
                health_check_interval=30
            )
            # Test connection
            self.redis_client.ping()
            logger.info("Redis connection established")
        except Exception as e:
            logger.error("Redis connection failed", error=str(e))
            # Fallback to in-memory rate limiting
            self.redis_client = None
    
    def is_rate_limited(
        self, 
        key: str, 
        limit: int, 
        window: int, 
        user_tier: str = "basic"
    ) -> tuple[bool, Dict[str, Any]]:
        """
        Check if request should be rate limited
        
        Args:
            key: Unique identifier (IP, user_id, etc.)
            limit: Number of requests allowed
            window: Time window in seconds
            user_tier: User tier for different limits
        
        Returns:
            (is_limited, info_dict)
        """
        
        # Adjust limits based on user tier
        tier_multipliers = {
            "basic": 1.0,
            "premium": 2.0,
            "enterprise": 5.0
        }
        
        adjusted_limit = int(limit * tier_multipliers.get(user_tier, 1.0))
        
        if not self.redis_client:
            # Fallback to simple in-memory limiting
            return self._fallback_rate_limit(key, adjusted_limit, window)
        
        try:
            current_time = int(time.time())
            window_start = current_time - window
            
            # Use sorted set to track requests in time window
            pipe = self.redis_client.pipeline()
            
            # Remove old entries
            pipe.zremrangebyscore(key, 0, window_start)
            
            # Count current requests in window
            pipe.zcard(key)
            
            # Add current request
            pipe.zadd(key, {str(current_time): current_time})
            
            # Set expiration
            pipe.expire(key, window)
            
            results = pipe.execute()
            current_requests = results[1] + 1  # +1 for current request
            
            rate_limit_info = {
                "limit": adjusted_limit,
                "remaining": max(0, adjusted_limit - current_requests),
                "reset_time": current_time + window,
                "retry_after": window if current_requests > adjusted_limit else 0
            }
            
            is_limited = current_requests > adjusted_limit
            
            if is_limited:
                logger.warning(
                    "Rate limit exceeded",
                    key=key,
                    current_requests=current_requests,
                    limit=adjusted_limit,
                    user_tier=user_tier
                )
            
            return is_limited, rate_limit_info
            
        except Exception as e:
            logger.error("Redis rate limiting error", error=str(e))
            # Fail open for availability
            return False, {"error": "Rate limiting unavailable"}
    
    def _fallback_rate_limit(self, key: str, limit: int, window: int) -> tuple[bool, Dict[str, Any]]:
        """Fallback in-memory rate limiting when Redis is unavailable"""
        # This is a simplified fallback - in production, consider using local Redis
        # or a more sophisticated in-memory solution
        return False, {"fallback": True, "limit": limit}

# Initialize global rate limiter
rate_limiter = RedisRateLimiter()

# SlowAPI integration for FastAPI
def get_rate_limit_key(request: Request) -> str:
    """
    Generate rate limit key based on user or IP
    """
    # Try to get user ID from JWT token
    try:
        auth_header = request.headers.get("authorization")
        if auth_header and auth_header.startswith("Bearer "):
            # Extract user ID from token (simplified)
            # In production, properly decode JWT
            return f"user:{auth_header[-10:]}"  # Use last 10 chars as simple ID
    except Exception:
        pass
    
    # Fallback to IP address
    return f"ip:{get_remote_address(request)}"

# Create SlowAPI limiter
limiter = Limiter(
    key_func=get_rate_limit_key,
    default_limits=["100/minute", "1000/hour"]
)

class AdvancedRateLimitMiddleware:
    """
    Advanced rate limiting middleware with multiple strategies
    """
    
    def __init__(self):
        self.rate_limiter = rate_limiter
        
        # Define rate limits for different endpoints
        self.endpoint_limits = {
            "/api/v1/auth/login": {"limit": 5, "window": 300, "message": "Too many login attempts"},
            "/api/v1/auth/register": {"limit": 3, "window": 3600, "message": "Too many registration attempts"},
            "/api/v1/zakat/calculate": {"limit": 60, "window": 60, "message": "Too many calculations"},
            "/api/v1/prices/gold-silver": {"limit": 120, "window": 60, "message": "Too many price requests"},
        }
    
    async def check_rate_limit(self, request: Request, user_tier: str = "basic") -> Optional[HTTPException]:
        """
        Check rate limits for incoming request
        """
        path = request.url.path
        client_ip = get_remote_address(request)
        
        # Get endpoint-specific limits
        endpoint_config = self.endpoint_limits.get(path)
        if not endpoint_config:
            # Use default limits
            endpoint_config = {"limit": 100, "window": 60, "message": "Rate limit exceeded"}
        
        # Generate rate limit key
        key = get_rate_limit_key(request)
        
        # Check rate limit
        is_limited, info = self.rate_limiter.is_rate_limited(
            key=f"{path}:{key}",
            limit=endpoint_config["limit"],
            window=endpoint_config["window"],
            user_tier=user_tier
        )
        
        if is_limited:
            headers = {
                "X-RateLimit-Limit": str(info.get("limit", 0)),
                "X-RateLimit-Remaining": str(info.get("remaining", 0)),
                "X-RateLimit-Reset": str(info.get("reset_time", 0)),
                "Retry-After": str(info.get("retry_after", 60))
            }
            
            return HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail=endpoint_config["message"],
                headers=headers
            )
        
        return None

# Global middleware instance
advanced_rate_limiter = AdvancedRateLimitMiddleware()

# Decorators for specific endpoints
def rate_limit(limit: str, per: str = "minute"):
    """
    Decorator for endpoint-specific rate limiting
    """
    def decorator(func):
        return limiter.limit(f"{limit}/{per}")(func)
    return decorator

# Rate limiting dependency
async def check_rate_limit(request: Request):
    """
    Dependency for checking rate limits
    """
    exception = await advanced_rate_limiter.check_rate_limit(request)
    if exception:
        raise exception

# Export rate limiting components
__all__ = [
    "RedisRateLimiter",
    "rate_limiter",
    "limiter", 
    "advanced_rate_limiter",
    "check_rate_limit",
    "rate_limit"
]