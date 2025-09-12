# Security-hardened Pydantic models with strict validation
from pydantic import BaseModel, Field, validator, root_validator
from typing import Optional, List, Dict, Any
from decimal import Decimal, ROUND_HALF_UP
from datetime import datetime
from enum import Enum
import re

class CurrencyEnum(str, Enum):
    """Supported currencies with validation"""
    USD = "USD"
    EUR = "EUR"
    GBP = "GBP"
    SAR = "SAR"
    AED = "AED"
    PKR = "PKR"
    INR = "INR"
    BDT = "BDT"

class ZakatCalculationRequest(BaseModel):
    """
    Strict validation for Zakat calculation requests
    Prevents injection attacks and ensures data integrity
    """
    
    # Asset values - strictly positive decimals only
    cash_in_hand: Decimal = Field(
        default=Decimal("0.00"),
        ge=0,
        max_digits=15,
        decimal_places=2,
        description="Cash in hand (must be non-negative)"
    )
    
    cash_in_bank: Decimal = Field(
        default=Decimal("0.00"),
        ge=0,
        max_digits=15,
        decimal_places=2,
        description="Bank account balance"
    )
    
    gold_in_grams: Decimal = Field(
        default=Decimal("0.00"),
        ge=0,
        max_digits=10,
        decimal_places=3,
        description="Gold amount in grams"
    )
    
    silver_in_grams: Decimal = Field(
        default=Decimal("0.00"),
        ge=0,
        max_digits=10,
        decimal_places=3,
        description="Silver amount in grams"
    )
    
    investments: Decimal = Field(
        default=Decimal("0.00"),
        ge=0,
        max_digits=15,
        decimal_places=2,
        description="Investment portfolio value"
    )
    
    business_assets: Decimal = Field(
        default=Decimal("0.00"),
        ge=0,
        max_digits=15,
        decimal_places=2,
        description="Business assets value"
    )
    
    property_for_trading: Decimal = Field(
        default=Decimal("0.00"),
        ge=0,
        max_digits=15,
        decimal_places=2,
        description="Investment property value"
    )
    
    # Liabilities - strictly positive or zero
    loans: Decimal = Field(
        default=Decimal("0.00"),
        ge=0,
        max_digits=15,
        decimal_places=2,
        description="Outstanding loans"
    )
    
    bills: Decimal = Field(
        default=Decimal("0.00"),
        ge=0,
        max_digits=15,
        decimal_places=2,
        description="Immediate bills and taxes"
    )
    
    wages: Decimal = Field(
        default=Decimal("0.00"),
        ge=0,
        max_digits=15,
        decimal_places=2,
        description="Employee wages due"
    )
    
    # Currency with strict enum validation
    currency: CurrencyEnum = Field(
        default=CurrencyEnum.USD,
        description="Currency code"
    )
    
    # Boolean flag with strict validation
    held_for_one_year: bool = Field(
        default=True,
        description="Assets held for one Islamic year"
    )
    
    @validator("*", pre=True)
    def sanitize_inputs(cls, v):
        """Sanitize all inputs to prevent injection attacks"""
        if isinstance(v, str):
            # Remove any potential SQL injection patterns
            v = re.sub(r'[^\w\s\.\-]', '', str(v))
            # Limit string length
            v = v[:100] if len(v) > 100 else v
        return v
    
    @validator("cash_in_hand", "cash_in_bank", "investments", "business_assets", "property_for_trading")
    def validate_monetary_amounts(cls, v):
        """Validate monetary amounts are reasonable"""
        if v > Decimal("999999999999.99"):  # 1 trillion limit
            raise ValueError("Amount exceeds maximum allowed value")
        return v.quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)
    
    @validator("gold_in_grams", "silver_in_grams")
    def validate_precious_metals(cls, v):
        """Validate precious metal amounts are reasonable"""
        if v > Decimal("100000.000"):  # 100kg limit
            raise ValueError("Precious metal amount exceeds reasonable limit")
        return v.quantize(Decimal("0.001"), rounding=ROUND_HALF_UP)
    
    @root_validator
    def validate_total_assets(cls, values):
        """Ensure total assets don't exceed reasonable limits"""
        total_assets = sum([
            values.get("cash_in_hand", 0),
            values.get("cash_in_bank", 0),
            values.get("investments", 0),
            values.get("business_assets", 0),
            values.get("property_for_trading", 0)
        ])
        
        if total_assets > Decimal("999999999999.99"):
            raise ValueError("Total assets exceed maximum allowed value")
        
        return values
    
    class Config:
        # Security configurations
        validate_assignment = True
        str_strip_whitespace = True
        json_encoders = {
            Decimal: lambda v: str(v)  # Ensure proper decimal serialization
        }

class ZakatCalculationResponse(BaseModel):
    """Secure response model for Zakat calculations"""
    
    total_assets: Decimal = Field(description="Total calculated assets")
    total_liabilities: Decimal = Field(description="Total liabilities")
    net_wealth: Decimal = Field(description="Net wealth (assets - liabilities)")
    nisab_threshold: Decimal = Field(description="Nisab threshold in selected currency")
    meets_nisab: bool = Field(description="Whether wealth meets Nisab requirement")
    zakat_due: Decimal = Field(description="Zakat amount due (2.5% if applicable)")
    currency: CurrencyEnum = Field(description="Currency used for calculations")
    calculation_date: datetime = Field(description="When calculation was performed")
    gold_price_per_gram: Decimal = Field(description="Gold price used in calculation")
    silver_price_per_gram: Decimal = Field(description="Silver price used in calculation")
    
    class Config:
        json_encoders = {
            Decimal: lambda v: str(v),
            datetime: lambda v: v.isoformat()
        }

class UserRegistration(BaseModel):
    """Secure user registration with strict validation"""
    
    email: str = Field(
        ...,
        regex=r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$',
        description="Valid email address"
    )
    
    password: str = Field(
        ...,
        min_length=8,
        max_length=128,
        description="Strong password (min 8 chars)"
    )
    
    full_name: str = Field(
        ...,
        min_length=1,
        max_length=100,
        regex=r'^[a-zA-Z\s]+$',
        description="Full name (letters and spaces only)"
    )
    
    @validator("password")
    def validate_password_strength(cls, v):
        """Enforce strong password requirements"""
        if len(v) < 8:
            raise ValueError("Password must be at least 8 characters")
        
        if not re.search(r'[A-Z]', v):
            raise ValueError("Password must contain at least one uppercase letter")
        
        if not re.search(r'[a-z]', v):
            raise ValueError("Password must contain at least one lowercase letter")
        
        if not re.search(r'\d', v):
            raise ValueError("Password must contain at least one digit")
        
        if not re.search(r'[!@#$%^&*(),.?":{}|<>]', v):
            raise ValueError("Password must contain at least one special character")
        
        return v
    
    @validator("email")
    def validate_email_security(cls, v):
        """Additional email security validation"""
        # Prevent common email injection patterns
        dangerous_patterns = ['<', '>', '"', "'", '\\', '%', ';']
        if any(pattern in v for pattern in dangerous_patterns):
            raise ValueError("Email contains invalid characters")
        
        return v.lower().strip()

class UserLogin(BaseModel):
    """Secure login model"""
    
    email: str = Field(
        ...,
        description="Email address"
    )
    
    password: str = Field(
        ...,
        description="Password"
    )
    
    @validator("email")
    def validate_email_format(cls, v):
        """Basic email validation for login"""
        if '@' not in v or len(v) > 255:
            raise ValueError("Invalid email format")
        return v.lower().strip()

class TokenResponse(BaseModel):
    """Secure token response model"""
    
    access_token: str = Field(description="JWT access token")
    refresh_token: str = Field(description="Refresh token")
    token_type: str = Field(default="bearer", description="Token type")
    expires_in: int = Field(description="Token expiration in seconds")

class APIKeyRequest(BaseModel):
    """API key generation request"""
    
    name: str = Field(
        ...,
        min_length=1,
        max_length=50,
        regex=r'^[a-zA-Z0-9_\-\s]+$',
        description="API key name"
    )
    
    permissions: Optional[List[str]] = Field(
        default=["zakat:calculate"],
        description="API key permissions"
    )

# Export models
__all__ = [
    "ZakatCalculationRequest",
    "ZakatCalculationResponse", 
    "UserRegistration",
    "UserLogin",
    "TokenResponse",
    "APIKeyRequest",
    "CurrencyEnum"
]