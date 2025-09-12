# Secure Zakat Calculator API Routes
from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.orm import Session
from decimal import Decimal
from datetime import datetime
import httpx
from typing import Optional

from app.database.models import get_db, ZakatCalculation
from app.models.schemas import ZakatCalculationRequest, ZakatCalculationResponse
from app.auth.security import get_current_active_user
from app.security.rate_limiting import check_rate_limit, rate_limit
from app.config import settings
import structlog

logger = structlog.get_logger()
router = APIRouter(prefix="/api/v1/zakat", tags=["Zakat Calculator"])

# Constants for Nisab calculation (from Islamic law)
NISAB_GOLD_GRAMS = Decimal("87.48")    # 20 Mithqal
NISAB_SILVER_GRAMS = Decimal("612.36") # 200 Dirhams
ZAKAT_PERCENTAGE = Decimal("0.025")    # 2.5%

class PriceService:
    """Secure service for fetching precious metal prices"""
    
    def __init__(self):
        self.base_url = settings.coingecko_base_url
        self.api_key = settings.coingecko_api_key
        self.fallback_prices = {
            "gold": Decimal("75.00"),   # USD per gram
            "silver": Decimal("0.95")   # USD per gram
        }
    
    async def get_precious_metal_prices(self) -> dict:
        """
        Fetch current gold and silver prices with security and fallback
        """
        try:
            headers = {}
            if self.api_key:
                headers["X-CG-Pro-API-Key"] = self.api_key
            
            url = f"{self.base_url}/simple/price"
            params = {
                "ids": "gold,silver",
                "vs_currencies": "usd"
            }
            
            async with httpx.AsyncClient(timeout=10.0) as client:
                response = await client.get(url, params=params, headers=headers)
                response.raise_for_status()
                
                data = response.json()
                
                # Convert from USD per ounce to USD per gram
                OUNCES_TO_GRAMS = Decimal("31.1035")
                
                gold_price = None
                silver_price = None
                
                if "gold" in data and "usd" in data["gold"]:
                    gold_price = Decimal(str(data["gold"]["usd"])) / OUNCES_TO_GRAMS
                
                if "silver" in data and "usd" in data["silver"]:
                    silver_price = Decimal(str(data["silver"]["usd"])) / OUNCES_TO_GRAMS
                
                if gold_price and silver_price:
                    logger.info(
                        "Precious metal prices fetched",
                        gold_price=float(gold_price),
                        silver_price=float(silver_price)
                    )
                    return {
                        "gold": gold_price.quantize(Decimal("0.01")),
                        "silver": silver_price.quantize(Decimal("0.0001"))
                    }
                else:
                    raise ValueError("Invalid price data received")
                    
        except Exception as e:
            logger.warning(
                "Failed to fetch live prices, using fallback",
                error=str(e)
            )
            return self.fallback_prices

price_service = PriceService()

class ZakatCalculatorService:
    """Secure service for Zakat calculations"""
    
    @staticmethod
    def calculate_zakat(
        data: ZakatCalculationRequest,
        gold_price: Decimal,
        silver_price: Decimal
    ) -> ZakatCalculationResponse:
        """
        Perform secure Zakat calculation with validation
        """
        try:
            # Calculate asset values
            gold_value = data.gold_in_grams * gold_price
            silver_value = data.silver_in_grams * silver_price
            
            # Total assets
            total_assets = (
                data.cash_in_hand +
                data.cash_in_bank +
                gold_value +
                silver_value +
                data.investments +
                data.business_assets +
                data.property_for_trading
            )
            
            # Total liabilities
            total_liabilities = data.loans + data.bills + data.wages
            
            # Net wealth
            net_wealth = total_assets - total_liabilities
            
            # Nisab threshold (lower of gold or silver)
            gold_nisab = NISAB_GOLD_GRAMS * gold_price
            silver_nisab = NISAB_SILVER_GRAMS * silver_price
            nisab_threshold = min(gold_nisab, silver_nisab)
            
            # Check if Zakat is due
            meets_nisab = net_wealth >= nisab_threshold and data.held_for_one_year
            zakat_due = net_wealth * ZAKAT_PERCENTAGE if meets_nisab else Decimal("0.00")
            
            return ZakatCalculationResponse(
                total_assets=total_assets,
                total_liabilities=total_liabilities,
                net_wealth=net_wealth,
                nisab_threshold=nisab_threshold,
                meets_nisab=meets_nisab,
                zakat_due=zakat_due,
                currency=data.currency,
                calculation_date=datetime.utcnow(),
                gold_price_per_gram=gold_price,
                silver_price_per_gram=silver_price
            )
            
        except Exception as e:
            logger.error("Zakat calculation error", error=str(e))
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Calculation failed"
            )

calculator_service = ZakatCalculatorService()

@router.post("/calculate", response_model=ZakatCalculationResponse)
@rate_limit("60/minute")  # Rate limiting
async def calculate_zakat(
    request: Request,
    calculation_data: ZakatCalculationRequest,
    db: Session = Depends(get_db),
    current_user: Optional[dict] = Depends(get_current_active_user)
):
    """
    Calculate Zakat with comprehensive security and validation
    """
    try:
        # Additional rate limiting check
        await check_rate_limit(request)
        
        # Fetch current precious metal prices
        prices = await price_service.get_precious_metal_prices()
        
        # Perform calculation
        result = calculator_service.calculate_zakat(
            calculation_data,
            prices["gold"],
            prices["silver"]
        )
        
        # Store calculation for audit (optional for anonymous users)
        try:
            calculation_record = ZakatCalculation(
                user_id=current_user.get("sub") if current_user else None,
                
                # Input data
                cash_in_hand=calculation_data.cash_in_hand,
                cash_in_bank=calculation_data.cash_in_bank,
                gold_in_grams=calculation_data.gold_in_grams,
                silver_in_grams=calculation_data.silver_in_grams,
                investments=calculation_data.investments,
                business_assets=calculation_data.business_assets,
                property_for_trading=calculation_data.property_for_trading,
                loans=calculation_data.loans,
                bills=calculation_data.bills,
                wages=calculation_data.wages,
                currency=calculation_data.currency.value,
                held_for_one_year=calculation_data.held_for_one_year,
                
                # Results
                total_assets=result.total_assets,
                total_liabilities=result.total_liabilities,
                net_wealth=result.net_wealth,
                nisab_threshold=result.nisab_threshold,
                meets_nisab=result.meets_nisab,
                zakat_due=result.zakat_due,
                
                # Market data
                gold_price_per_gram=result.gold_price_per_gram,
                silver_price_per_gram=result.silver_price_per_gram,
                
                # Audit data
                client_ip=request.client.host if request.client else None,
                user_agent=request.headers.get("user-agent")
            )
            
            db.add(calculation_record)
            db.commit()
            
        except Exception as e:
            logger.warning("Failed to store calculation record", error=str(e))
            # Don't fail the request if audit storage fails
            db.rollback()
        
        logger.info(
            "Zakat calculation completed",
            user_id=current_user.get("sub") if current_user else "anonymous",
            net_wealth=float(result.net_wealth),
            zakat_due=float(result.zakat_due),
            meets_nisab=result.meets_nisab
        )
        
        return result
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error("Unexpected error in zakat calculation", error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error"
        )

@router.get("/prices", response_model=dict)
@rate_limit("120/minute")
async def get_precious_metal_prices(
    request: Request,
    current_user: Optional[dict] = Depends(get_current_active_user)
):
    """
    Get current gold and silver prices
    """
    try:
        await check_rate_limit(request)
        
        prices = await price_service.get_precious_metal_prices()
        
        return {
            "success": True,
            "data": {
                "gold": str(prices["gold"]),
                "silver": str(prices["silver"]),
                "currency": "USD",
                "unit": "per_gram",
                "last_updated": datetime.utcnow().isoformat(),
                "source": "CoinGecko API"
            }
        }
        
    except Exception as e:
        logger.error("Error fetching precious metal prices", error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch current prices"
        )

@router.get("/nisab", response_model=dict)
async def get_nisab_info(
    request: Request,
    current_user: Optional[dict] = Depends(get_current_active_user)
):
    """
    Get current Nisab thresholds
    """
    try:
        await check_rate_limit(request)
        
        prices = await price_service.get_precious_metal_prices()
        
        gold_nisab = NISAB_GOLD_GRAMS * prices["gold"]
        silver_nisab = NISAB_SILVER_GRAMS * prices["silver"]
        
        return {
            "success": True,
            "data": {
                "gold_nisab": {
                    "amount_usd": str(gold_nisab),
                    "grams": str(NISAB_GOLD_GRAMS),
                    "price_per_gram": str(prices["gold"])
                },
                "silver_nisab": {
                    "amount_usd": str(silver_nisab),
                    "grams": str(NISAB_SILVER_GRAMS),
                    "price_per_gram": str(prices["silver"])
                },
                "current_nisab": str(min(gold_nisab, silver_nisab)),
                "zakat_percentage": str(ZAKAT_PERCENTAGE * 100) + "%",
                "currency": "USD",
                "last_updated": datetime.utcnow().isoformat()
            }
        }
        
    except Exception as e:
        logger.error("Error fetching Nisab information", error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch Nisab information"
        )