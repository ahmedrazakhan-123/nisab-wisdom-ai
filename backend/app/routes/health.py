# Health check and monitoring routes
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import datetime
import psutil
import platform
from typing import Dict, Any

from app.database.models import get_db, db_manager
from app.config import settings
from app.security.rate_limiting import rate_limiter
import structlog

logger = structlog.get_logger()

router = APIRouter(prefix="/api/v1/health", tags=["Health & Monitoring"])

@router.get("/")
async def basic_health_check():
    """Basic health check endpoint"""
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat(),
        "service": "Nisab Wisdom AI API",
        "version": settings.app_version
    }

@router.get("/detailed")
async def detailed_health_check(db: Session = Depends(get_db)) -> Dict[str, Any]:
    """
    Comprehensive health check with system metrics
    """
    health_status = {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat(),
        "service": "Nisab Wisdom AI API",
        "version": settings.app_version,
        "environment": settings.environment,
        "checks": {}
    }
    
    # Database health check
    try:
        db_healthy = db_manager.health_check()
        health_status["checks"]["database"] = {
            "status": "healthy" if db_healthy else "unhealthy",
            "message": "Database connection successful" if db_healthy else "Database connection failed"
        }
    except Exception as e:
        health_status["checks"]["database"] = {
            "status": "unhealthy",
            "message": f"Database error: {str(e)}"
        }
        health_status["status"] = "unhealthy"
    
    # Redis health check (for rate limiting)
    try:
        if rate_limiter.redis_client:
            rate_limiter.redis_client.ping()
            health_status["checks"]["redis"] = {
                "status": "healthy",
                "message": "Redis connection successful"
            }
        else:
            health_status["checks"]["redis"] = {
                "status": "degraded",
                "message": "Redis not available, using fallback"
            }
    except Exception as e:
        health_status["checks"]["redis"] = {
            "status": "unhealthy",
            "message": f"Redis error: {str(e)}"
        }
    
    # System metrics
    try:
        health_status["system"] = {
            "cpu_percent": psutil.cpu_percent(interval=1),
            "memory_percent": psutil.virtual_memory().percent,
            "disk_percent": psutil.disk_usage('/').percent,
            "platform": platform.platform(),
            "python_version": platform.python_version()
        }
    except Exception as e:
        health_status["system"] = {
            "error": f"Failed to get system metrics: {str(e)}"
        }
    
    # Determine overall status
    if any(check.get("status") == "unhealthy" for check in health_status["checks"].values()):
        health_status["status"] = "unhealthy"
    elif any(check.get("status") == "degraded" for check in health_status["checks"].values()):
        health_status["status"] = "degraded"
    
    return health_status

@router.get("/ready")
async def readiness_check(db: Session = Depends(get_db)):
    """
    Kubernetes readiness probe endpoint
    """
    try:
        # Check if all critical services are ready
        db_ready = db_manager.health_check()
        
        if not db_ready:
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail="Service not ready - database unavailable"
            )
        
        return {
            "status": "ready",
            "timestamp": datetime.utcnow().isoformat()
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error("Readiness check failed", error=str(e))
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Service not ready"
        )

@router.get("/live")
async def liveness_check():
    """
    Kubernetes liveness probe endpoint
    """
    return {
        "status": "alive",
        "timestamp": datetime.utcnow().isoformat()
    }