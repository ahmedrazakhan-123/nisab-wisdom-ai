# Production-ready FastAPI application with enterprise security
from fastapi import FastAPI, Request, HTTPException, status
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import sentry_sdk
from sentry_sdk.integrations.fastapi import FastApiIntegration
from sentry_sdk.integrations.sqlalchemy import SqlalchemyIntegration
import structlog
import sys
from contextlib import asynccontextmanager

# Import our modules
from app.config import settings, validate_production_security
from app.security.middleware import setup_security_middleware
from app.security.rate_limiting import limiter
from app.database.models import db_manager
from app.routes import zakat, auth, health
from app.api.v1 import chat

# Configure structured logging
structlog.configure(
    processors=[
        structlog.stdlib.filter_by_level,
        structlog.stdlib.add_logger_name,
        structlog.stdlib.add_log_level,
        structlog.stdlib.PositionalArgumentsFormatter(),
        structlog.processors.TimeStamper(fmt="iso"),
        structlog.processors.StackInfoRenderer(),
        structlog.processors.format_exc_info,
        structlog.processors.UnicodeDecoder(),
        structlog.processors.JSONRenderer()
    ],
    context_class=dict,
    logger_factory=structlog.stdlib.LoggerFactory(),
    wrapper_class=structlog.stdlib.BoundLogger,
    cache_logger_on_first_use=True,
)

logger = structlog.get_logger()

# Initialize Sentry for error monitoring
if settings.sentry_dsn:
    sentry_sdk.init(
        dsn=settings.sentry_dsn,
        integrations=[
            FastApiIntegration(auto_enabling=True),
            SqlalchemyIntegration(),
        ],
        traces_sample_rate=0.1,  # 10% of transactions for performance monitoring
        environment=settings.environment,
        release=settings.app_version,
    )

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan management"""
    # Startup
    logger.info("Starting Nisab Wisdom AI API", version=settings.app_version)
    
    # Validate production security settings
    validate_production_security()
    
    # Test database connection
    if not db_manager.health_check():
        logger.error("Database health check failed")
        sys.exit(1)
    
    # Create database tables
    try:
        db_manager.create_tables()
        logger.info("Database tables ready")
    except Exception as e:
        logger.error("Failed to create database tables", error=str(e))
        sys.exit(1)
    
    logger.info("Application startup completed successfully")
    
    yield
    
    # Shutdown
    logger.info("Shutting down Nisab Wisdom AI API")

# Create FastAPI application
app = FastAPI(
    title="Nisab Wisdom AI API",
    description="Enterprise-grade Zakat Calculator API with advanced security",
    version=settings.app_version,
    docs_url="/docs" if settings.debug else None,  # Disable docs in production
    redoc_url="/redoc" if settings.debug else None,
    openapi_url="/openapi.json" if settings.debug else None,
    lifespan=lifespan
)

# Setup security middleware
setup_security_middleware(app)

# Add rate limiting
app.state.limiter = limiter

# Include routers
app.include_router(health.router)
app.include_router(auth.router)
app.include_router(zakat.router)
app.include_router(chat.router, prefix="/api/v1")

# Global exception handlers
@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    """Handle HTTP exceptions with security considerations"""
    
    # Log security-relevant errors
    if exc.status_code in [401, 403, 429]:
        logger.warning(
            "Security exception",
            status_code=exc.status_code,
            detail=exc.detail,
            client_ip=request.client.host if request.client else "unknown",
            path=request.url.path,
            method=request.method
        )
    
    # Don't leak internal details in production
    detail = exc.detail
    if settings.environment == "production" and exc.status_code >= 500:
        detail = "Internal server error"
    
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "error": True,
            "message": detail,
            "status_code": exc.status_code,
            "timestamp": structlog.processors.TimeStamper().format_timestamp(None)
        }
    )

@app.exception_handler(Exception)
async def general_exception_handler(request: Request, exc: Exception):
    """Handle unexpected exceptions"""
    
    logger.error(
        "Unexpected exception",
        error=str(exc),
        client_ip=request.client.host if request.client else "unknown",
        path=request.url.path,
        method=request.method,
        exc_info=True
    )
    
    return JSONResponse(
        status_code=500,
        content={
            "error": True,
            "message": "Internal server error" if settings.environment == "production" else str(exc),
            "status_code": 500,
            "timestamp": structlog.processors.TimeStamper().format_timestamp(None)
        }
    )

# Root endpoint
@app.get("/")
async def root():
    """API root endpoint"""
    return {
        "message": "Nisab Wisdom AI API",
        "version": settings.app_version,
        "environment": settings.environment,
        "status": "operational"
    }

# Health check endpoint
@app.get("/health")
async def health_check():
    """Basic health check"""
    return {
        "status": "healthy",
        "timestamp": structlog.processors.TimeStamper().format_timestamp(None),
        "version": settings.app_version
    }

if __name__ == "__main__":
    import uvicorn
    
    # Production server configuration
    uvicorn.run(
        "app.main:app",
        host=settings.host,
        port=settings.port,
        workers=settings.workers if settings.environment == "production" else 1,
        reload=settings.debug,
        access_log=settings.debug,
        log_level=settings.log_level.lower(),
        server_header=False,  # Don't expose server version
        date_header=False,    # Don't expose date header
    )