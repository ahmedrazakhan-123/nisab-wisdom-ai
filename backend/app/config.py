# Configuration Management with Security Validation
from pydantic import validator, Field
from pydantic_settings import BaseSettings
from typing import List, Optional
import secrets
from pathlib import Path

class Settings(BaseSettings):
    """
    Production-ready configuration with security validation
    """
    
    # Application
    environment: str = Field(default="production", env="ENVIRONMENT")
    debug: bool = Field(default=False, env="DEBUG")
    app_name: str = Field(default="Nisab Wisdom AI", env="APP_NAME")
    app_version: str = Field(default="1.0.0", env="APP_VERSION")
    
    # Security - CRITICAL: Must be strong in production
    secret_key: str = Field(env="SECRET_KEY")
    jwt_secret_key: str = Field(env="JWT_SECRET_KEY")
    jwt_algorithm: str = Field(default="HS256", env="JWT_ALGORITHM")
    jwt_access_token_expire_minutes: int = Field(default=30, env="JWT_ACCESS_TOKEN_EXPIRE_MINUTES")
    jwt_refresh_token_expire_days: int = Field(default=30, env="JWT_REFRESH_TOKEN_EXPIRE_DAYS")
    
    # Database
    database_url: str = Field(env="DATABASE_URL")
    database_pool_size: int = Field(default=20, env="DATABASE_POOL_SIZE")
    database_max_overflow: int = Field(default=30, env="DATABASE_MAX_OVERFLOW")
    
    # Redis
    redis_url: str = Field(env="REDIS_URL")
    redis_password: Optional[str] = Field(default=None, env="REDIS_PASSWORD")
    
    # CORS - STRICT: Only allow your domains
    allowed_origins: List[str] = Field(env="ALLOWED_ORIGINS")
    allowed_methods: List[str] = Field(default=["GET", "POST"], env="ALLOWED_METHODS")
    allowed_headers: List[str] = Field(default=["Authorization", "Content-Type"], env="ALLOWED_HEADERS")
    
    # Rate Limiting
    rate_limit_requests_per_minute: int = Field(default=60, env="RATE_LIMIT_REQUESTS_PER_MINUTE")
    rate_limit_burst: int = Field(default=100, env="RATE_LIMIT_BURST")
    
    # External APIs
    coingecko_api_key: Optional[str] = Field(default=None, env="COINGECKO_API_KEY")
    coingecko_base_url: str = Field(default="https://api.coingecko.com/api/v3", env="COINGECKO_BASE_URL")
    
    # Security Headers
    security_hsts_max_age: int = Field(default=31536000, env="SECURITY_HSTS_MAX_AGE")
    security_content_type_nosniff: bool = Field(default=True, env="SECURITY_CONTENT_TYPE_NOSNIFF")
    security_frame_deny: bool = Field(default=True, env="SECURITY_FRAME_DENY")
    security_xss_protection: bool = Field(default=True, env="SECURITY_XSS_PROTECTION")
    
    # Monitoring
    sentry_dsn: Optional[str] = Field(default=None, env="SENTRY_DSN")
    log_level: str = Field(default="INFO", env="LOG_LEVEL")
    
    # AI Chatbot Configuration
    deepseek_api_key: Optional[str] = Field(default=None, env="DEEPSEEK_API_KEY")
    chat_max_tokens: int = Field(default=1500, env="CHAT_MAX_TOKENS")
    chat_temperature: float = Field(default=0.7, env="CHAT_TEMPERATURE")
    chat_timeout: int = Field(default=30, env="CHAT_TIMEOUT")
    
    # Server
    host: str = Field(default="0.0.0.0", env="HOST")
    port: int = Field(default=8000, env="PORT")
    workers: int = Field(default=4, env="WORKERS")
    
    @validator("secret_key", "jwt_secret_key")
    def validate_secret_strength(cls, v):
        """Ensure secrets are strong enough for production"""
        if len(v) < 32:
            raise ValueError("Secret keys must be at least 32 characters long")
        return v
    
    @validator("allowed_origins")
    def validate_cors_origins(cls, v):
        """Ensure CORS origins are explicitly set in production"""
        if not v or v == ["*"]:
            raise ValueError("CORS origins must be explicitly configured for production")
        return v
    
    @validator("environment")
    def validate_environment(cls, v):
        """Ensure environment is properly set"""
        if v not in ["development", "staging", "production"]:
            raise ValueError("Environment must be: development, staging, or production")
        return v
    
    @validator("debug")
    def validate_debug_in_production(cls, v, values):
        """Ensure debug is disabled in production"""
        if values.get("environment") == "production" and v:
            raise ValueError("Debug mode must be disabled in production")
        return v
    
    class Config:
        env_file = ".env"
        case_sensitive = False
        
        @classmethod
        def generate_secret_key(cls) -> str:
            """Generate a cryptographically secure secret key"""
            return secrets.token_urlsafe(32)

# Global settings instance
settings = Settings()

# Validate critical security settings on startup
def validate_production_security():
    """Run additional security validations for production"""
    if settings.environment == "production":
        assert not settings.debug, "Debug must be disabled in production"
        assert len(settings.secret_key) >= 32, "Secret key too weak"
        assert len(settings.jwt_secret_key) >= 32, "JWT secret key too weak"
        assert settings.allowed_origins != ["*"], "CORS must be configured for production"
        assert settings.database_url.startswith(("postgresql://", "postgresql+asyncpg://")), "Use PostgreSQL in production"
        print("✅ Production security validation passed")
    else:
        print(f"⚠️  Running in {settings.environment} mode")

# Export settings
__all__ = ["settings", "validate_production_security"]