# Secure Authentication Routes
from fastapi import APIRouter, Depends, HTTPException, status, Request
from fastapi.security import HTTPBearer
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from typing import Optional

from app.database.models import get_db, User
from app.models.schemas import UserRegistration, UserLogin, TokenResponse
from app.auth.security import token_manager, get_current_user
from app.security.rate_limiting import check_rate_limit, rate_limit
import structlog

logger = structlog.get_logger()
security = HTTPBearer()

router = APIRouter(prefix="/api/v1/auth", tags=["Authentication"])

# Maximum failed login attempts before lockout
MAX_FAILED_ATTEMPTS = 5
LOCKOUT_DURATION = timedelta(minutes=15)

@router.post("/register", response_model=dict)
@rate_limit("3/hour")  # Strict rate limiting for registration
async def register_user(
    request: Request,
    user_data: UserRegistration,
    db: Session = Depends(get_db)
):
    """
    Register a new user with comprehensive security checks
    """
    try:
        await check_rate_limit(request)
        
        # Check if user already exists
        existing_user = db.query(User).filter(User.email == user_data.email).first()
        if existing_user:
            # Don't reveal if user exists for security
            logger.warning(
                "Registration attempt with existing email",
                email=user_data.email,
                client_ip=request.client.host if request.client else "unknown"
            )
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Registration failed"
            )
        
        # Hash password
        hashed_password = token_manager.hash_password(user_data.password)
        
        # Create new user
        new_user = User(
            email=user_data.email,
            full_name=user_data.full_name,
            hashed_password=hashed_password,
            is_active=True,
            is_verified=False  # Require email verification in production
        )
        
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
        
        logger.info(
            "User registered successfully",
            user_id=new_user.id,
            email=new_user.email,
            client_ip=request.client.host if request.client else "unknown"
        )
        
        return {
            "success": True,
            "message": "User registered successfully",
            "user_id": new_user.id
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error("Registration error", error=str(e))
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Registration failed"
        )

@router.post("/login", response_model=TokenResponse)
@rate_limit("5/5minute")  # Rate limiting for login attempts
async def login_user(
    request: Request,
    login_data: UserLogin,
    db: Session = Depends(get_db)
):
    """
    User login with security protections against brute force attacks
    """
    try:
        await check_rate_limit(request)
        
        # Get user from database
        user = db.query(User).filter(User.email == login_data.email).first()
        
        if not user:
            # Use same timing as successful login to prevent timing attacks
            token_manager.verify_password("dummy_password", "dummy_hash")
            logger.warning(
                "Login attempt with non-existent email",
                email=login_data.email,
                client_ip=request.client.host if request.client else "unknown"
            )
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid credentials"
            )
        
        # Check if account is locked
        if user.last_login_attempt:
            time_since_last_attempt = datetime.utcnow() - user.last_login_attempt
            if (user.failed_login_attempts >= MAX_FAILED_ATTEMPTS and 
                time_since_last_attempt < LOCKOUT_DURATION):
                logger.warning(
                    "Login attempt on locked account",
                    user_id=user.id,
                    failed_attempts=user.failed_login_attempts,
                    client_ip=request.client.host if request.client else "unknown"
                )
                raise HTTPException(
                    status_code=status.HTTP_423_LOCKED,
                    detail="Account temporarily locked due to too many failed attempts"
                )
        
        # Verify password
        if not token_manager.verify_password(login_data.password, user.hashed_password):
            # Increment failed attempts
            user.failed_login_attempts += 1
            user.last_login_attempt = datetime.utcnow()
            db.commit()
            
            logger.warning(
                "Failed login attempt",
                user_id=user.id,
                failed_attempts=user.failed_login_attempts,
                client_ip=request.client.host if request.client else "unknown"
            )
            
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid credentials"
            )
        
        # Check if user is active
        if not user.is_active:
            logger.warning(
                "Login attempt on inactive account",
                user_id=user.id,
                client_ip=request.client.host if request.client else "unknown"
            )
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Account is deactivated"
            )
        
        # Reset failed attempts on successful login
        user.failed_login_attempts = 0
        user.last_successful_login = datetime.utcnow()
        user.last_login_attempt = datetime.utcnow()
        db.commit()
        
        # Create tokens
        access_token = token_manager.create_access_token(
            data={"sub": user.id, "email": user.email}
        )
        refresh_token = token_manager.create_refresh_token(user.id)
        
        logger.info(
            "User logged in successfully",
            user_id=user.id,
            client_ip=request.client.host if request.client else "unknown"
        )
        
        return TokenResponse(
            access_token=access_token,
            refresh_token=refresh_token,
            token_type="bearer",
            expires_in=1800  # 30 minutes
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error("Login error", error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Login failed"
        )

@router.post("/refresh", response_model=TokenResponse)
@rate_limit("10/minute")
async def refresh_token(
    request: Request,
    refresh_token: str,
    db: Session = Depends(get_db)
):
    """
    Refresh access token using refresh token
    """
    try:
        await check_rate_limit(request)
        
        # Validate refresh token
        if not token_manager.is_refresh_token_valid(refresh_token):
            logger.warning(
                "Invalid refresh token used",
                client_ip=request.client.host if request.client else "unknown"
            )
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid refresh token"
            )
        
        # In production, decode refresh token to get user ID
        # For now, we'll need to implement refresh token storage with user mapping
        
        # Revoke old refresh token and create new ones
        token_manager.revoke_refresh_token(refresh_token)
        
        # This is simplified - in production, get user_id from refresh token
        # and create new tokens for that user
        
        return {
            "message": "Refresh token functionality - implement with proper token storage"
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error("Token refresh error", error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Token refresh failed"
        )

@router.post("/logout")
async def logout_user(
    request: Request,
    current_user: dict = Depends(get_current_user)
):
    """
    Logout user and revoke tokens
    """
    try:
        # Revoke the current token
        jti = current_user.get("jti")
        if jti:
            token_manager.revoke_token(jti)
        
        logger.info(
            "User logged out",
            user_id=current_user.get("sub"),
            client_ip=request.client.host if request.client else "unknown"
        )
        
        return {
            "success": True,
            "message": "Logged out successfully"
        }
        
    except Exception as e:
        logger.error("Logout error", error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Logout failed"
        )

@router.get("/me")
async def get_current_user_info(
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get current user information
    """
    try:
        user = db.query(User).filter(User.id == current_user.get("sub")).first()
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        
        return {
            "user_id": user.id,
            "email": user.email,
            "full_name": user.full_name,
            "is_verified": user.is_verified,
            "created_at": user.created_at.isoformat()
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error("Get user info error", error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to get user information"
        )