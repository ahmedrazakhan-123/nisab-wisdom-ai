# Security-hardened JWT authentication with refresh tokens
from datetime import datetime, timedelta
from typing import Optional, Dict, Any
from jose import JWTError, jwt
from passlib.context import CryptContext
from passlib.hash import bcrypt
from fastapi import HTTPException, status, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import secrets
import uuid
from app.config import settings

# Password hashing with strong parameters
pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto",
    bcrypt__rounds=12,  # Strong rounds for production
    bcrypt__ident="2b"  # Use latest bcrypt variant
)

# JWT Bearer token scheme
security = HTTPBearer(auto_error=True)

class TokenSecurityManager:
    """
    Enterprise-grade token security with refresh tokens,
    token rotation, and revocation capabilities
    """
    
    def __init__(self):
        self.revoked_tokens = set()  # In production, use Redis
        self.refresh_token_whitelist = set()  # In production, use Redis
    
    def hash_password(self, password: str) -> str:
        """Hash password with strong bcrypt settings"""
        if len(password) < 8:
            raise ValueError("Password must be at least 8 characters")
        return pwd_context.hash(password)
    
    def verify_password(self, plain_password: str, hashed_password: str) -> bool:
        """Verify password with timing attack protection"""
        try:
            return pwd_context.verify(plain_password, hashed_password)
        except Exception:
            # Still take time to prevent timing attacks
            pwd_context.hash("dummy_password")
            return False
    
    def create_access_token(
        self, 
        data: Dict[str, Any], 
        expires_delta: Optional[timedelta] = None
    ) -> str:
        """Create JWT access token with security claims"""
        to_encode = data.copy()
        
        # Add security claims
        now = datetime.utcnow()
        to_encode.update({
            "iat": now,  # Issued at
            "nbf": now,  # Not before
            "jti": str(uuid.uuid4()),  # JWT ID for revocation
            "type": "access"
        })
        
        if expires_delta:
            expire = now + expires_delta
        else:
            expire = now + timedelta(minutes=settings.jwt_access_token_expire_minutes)
        
        to_encode.update({"exp": expire})
        
        encoded_jwt = jwt.encode(
            to_encode, 
            settings.jwt_secret_key, 
            algorithm=settings.jwt_algorithm
        )
        return encoded_jwt
    
    def create_refresh_token(self, user_id: str) -> str:
        """Create secure refresh token"""
        refresh_token = secrets.token_urlsafe(32)
        
        # Store in whitelist (use Redis in production)
        self.refresh_token_whitelist.add(refresh_token)
        
        # Set expiration (cleanup old tokens periodically)
        # In production, use Redis with TTL
        
        return refresh_token
    
    def verify_token(self, token: str, token_type: str = "access") -> Dict[str, Any]:
        """Verify JWT token with comprehensive security checks"""
        try:
            # Check if token is revoked
            payload = jwt.decode(
                token, 
                settings.jwt_secret_key, 
                algorithms=[settings.jwt_algorithm]
            )
            
            # Verify token type
            if payload.get("type") != token_type:
                raise JWTError("Invalid token type")
            
            # Check if token is revoked
            jti = payload.get("jti")
            if jti and jti in self.revoked_tokens:
                raise JWTError("Token has been revoked")
            
            # Verify required claims
            required_claims = ["sub", "exp", "iat", "jti"]
            if not all(claim in payload for claim in required_claims):
                raise JWTError("Missing required claims")
            
            return payload
            
        except JWTError:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid authentication credentials",
                headers={"WWW-Authenticate": "Bearer"},
            )
    
    def revoke_token(self, jti: str):
        """Revoke a specific token"""
        self.revoked_tokens.add(jti)
        # In production, store in Redis with appropriate TTL
    
    def revoke_refresh_token(self, refresh_token: str):
        """Revoke refresh token"""
        self.refresh_token_whitelist.discard(refresh_token)
    
    def is_refresh_token_valid(self, refresh_token: str) -> bool:
        """Check if refresh token is valid"""
        return refresh_token in self.refresh_token_whitelist

# Global token manager instance
token_manager = TokenSecurityManager()

def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> Dict[str, Any]:
    """
    Dependency to get current authenticated user
    """
    try:
        payload = token_manager.verify_token(credentials.credentials)
        user_id: str = payload.get("sub")
        if user_id is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid authentication credentials",
                headers={"WWW-Authenticate": "Bearer"},
            )
        return payload
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

def get_current_active_user(current_user: Dict[str, Any] = Depends(get_current_user)) -> Dict[str, Any]:
    """
    Dependency to get current active user (can add more checks here)
    """
    # Add additional user status checks here if needed
    return current_user

# API Key authentication for external services
class APIKeyManager:
    """
    Secure API key management for external service access
    """
    
    def __init__(self):
        # In production, store in database with proper encryption
        self.api_keys = {}
    
    def generate_api_key(self, name: str, permissions: list = None) -> str:
        """Generate a new API key"""
        api_key = f"nw_{secrets.token_urlsafe(32)}"
        self.api_keys[api_key] = {
            "name": name,
            "created_at": datetime.utcnow(),
            "permissions": permissions or [],
            "last_used": None,
            "usage_count": 0
        }
        return api_key
    
    def verify_api_key(self, api_key: str) -> bool:
        """Verify API key and update usage stats"""
        if api_key in self.api_keys:
            self.api_keys[api_key]["last_used"] = datetime.utcnow()
            self.api_keys[api_key]["usage_count"] += 1
            return True
        return False

api_key_manager = APIKeyManager()

# Export for use in routes
__all__ = [
    "token_manager", 
    "get_current_user", 
    "get_current_active_user",
    "api_key_manager"
]