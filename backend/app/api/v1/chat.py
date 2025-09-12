"""
Chat API endpoints for Islamic Finance AI
Secure, authenticated endpoints for AI-powered financial guidance
"""

from fastapi import APIRouter, Depends, HTTPException, status, Request
from fastapi.security import HTTPBearer
from sqlalchemy.orm import Session
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field, validator
import uuid
from datetime import datetime
import logging

from app.core.database import get_db
from app.auth.security import get_current_user
from app.models.schemas import User
from app.services.islamic_finance_ai import islamic_finance_ai
from app.security.rate_limiting import rate_limit

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/chat", tags=["Islamic Finance Chat"])
security = HTTPBearer()

# Pydantic models for request/response
class ChatMessage(BaseModel):
    message: str = Field(
        ..., 
        min_length=1, 
        max_length=2000,
        description="The user's question or message about Islamic finance"
    )
    conversation_id: Optional[str] = Field(
        None,
        description="Optional conversation ID to maintain context"
    )
    include_context: bool = Field(
        True,
        description="Whether to include conversation history for context"
    )
    
    @validator('message')
    def validate_message(cls, v):
        """Validate and clean the message"""
        if not v or not v.strip():
            raise ValueError("Message cannot be empty")
        
        # Basic length check
        if len(v.strip()) < 2:
            raise ValueError("Message too short")
            
        # Check for potential abuse patterns
        suspicious_patterns = ['<script', 'javascript:', 'eval(', 'exec(']
        v_lower = v.lower()
        for pattern in suspicious_patterns:
            if pattern in v_lower:
                raise ValueError("Invalid message content")
        
        return v.strip()

class ChatResponse(BaseModel):
    message: str
    intent: str
    status: str
    model: Optional[str] = None
    suggestions: List[str] = []
    conversation_id: str
    timestamp: str

class HealthResponse(BaseModel):
    service: str
    status: str
    details: Dict[str, Any]

@router.post("/islamic-finance", response_model=ChatResponse)
@rate_limit(calls=20, period=60)  # 20 messages per minute per user
async def chat_islamic_finance(
    chat_request: ChatMessage,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
    request: Request = None
):
    """
    Chat with Islamic Finance AI Expert
    
    Get Shariah-compliant advice on:
    - **Zakat calculations** and obligations
    - **Halal investment** strategies and screening
    - **Islamic banking** products and services
    - **Business ethics** in Islamic framework
    - **Modern finance** through Islamic lens
    
    **Authentication required**: This endpoint requires a valid JWT token.
    **Rate limited**: Maximum 20 messages per minute per user.
    """
    
    try:
        # Generate conversation ID if not provided
        conversation_id = chat_request.conversation_id or f"conv_{uuid.uuid4().hex[:12]}"
        
        # Create unique user session ID for AI service
        user_session_id = f"user_{current_user.id}_{conversation_id}"
        
        # Log the request for security auditing
        client_ip = getattr(request.client, 'host', 'unknown') if request else 'unknown'
        logger.info(
            f"Chat request from user {current_user.id} "
            f"(email: {current_user.email}) from IP {client_ip} "
            f"- Message length: {len(chat_request.message)}"
        )
        
        # Get AI response
        ai_response = await islamic_finance_ai.get_response(
            user_message=chat_request.message,
            user_id=user_session_id,
            include_context=chat_request.include_context
        )
        
        # Check if AI service returned an error
        if ai_response["status"] == "error":
            # Log the error but don't expose technical details to user
            logger.error(
                f"AI service error for user {current_user.id}: {ai_response.get('error', 'Unknown error')}"
            )
            
            # Return user-friendly error response
            if "technical difficulties" in ai_response["message"]:
                raise HTTPException(
                    status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                    detail="AI service temporarily unavailable. Please try again shortly."
                )
        
        # Prepare response
        response = ChatResponse(
            message=ai_response["message"],
            intent=ai_response["intent"],
            status=ai_response["status"],
            model=ai_response.get("model", "deepseek-chat"),
            suggestions=ai_response.get("suggestions", []),
            conversation_id=conversation_id,
            timestamp=ai_response.get("timestamp", datetime.utcnow().isoformat())
        )
        
        # Log successful response
        logger.info(
            f"Chat response sent to user {current_user.id} "
            f"- Intent: {response.intent}, Status: {response.status}"
        )
        
        return response
        
    except HTTPException:
        # Re-raise HTTP exceptions (like 503)
        raise
        
    except ValueError as e:
        # Handle validation errors
        logger.warning(f"Validation error for user {current_user.id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid request: {str(e)}"
        )
        
    except Exception as e:
        # Handle unexpected errors
        logger.error(f"Unexpected chat error for user {current_user.id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An unexpected error occurred. Please try again."
        )

@router.get("/health", response_model=HealthResponse)
async def chat_health_check(
    current_user: User = Depends(get_current_user)
):
    """
    Health check for Islamic Finance Chat service
    
    Returns the current status of:
    - AI service connectivity
    - DeepSeek API availability
    - System components health
    
    **Authentication required**: Requires valid JWT token.
    """
    
    try:
        # Get health status from AI service
        health_status = await islamic_finance_ai.health_check()
        
        # Determine overall status
        overall_status = "healthy"
        if health_status["status"] != "healthy":
            overall_status = "degraded"
        
        response = HealthResponse(
            service="islamic_finance_chat",
            status=overall_status,
            details={
                "ai_service": health_status,
                "timestamp": datetime.utcnow().isoformat(),
                "version": "1.0.0"
            }
        )
        
        logger.info(f"Health check requested by user {current_user.id} - Status: {overall_status}")
        
        return response
        
    except Exception as e:
        logger.error(f"Health check error: {str(e)}")
        return HealthResponse(
            service="islamic_finance_chat",
            status="unhealthy",
            details={
                "error": "Health check failed",
                "timestamp": datetime.utcnow().isoformat()
            }
        )

@router.get("/conversation-suggestions")
async def get_conversation_suggestions(
    current_user: User = Depends(get_current_user)
):
    """
    Get suggested conversation starters for Islamic Finance topics
    
    Returns curated questions to help users get started with the AI assistant.
    """
    
    suggestions = {
        "zakat": [
            "How do I calculate Zakat on my savings and investments?",
            "What is the nisab threshold for gold and silver?",
            "Do I need to pay Zakat on my retirement funds?",
            "How often should I calculate and pay Zakat?"
        ],
        "investments": [
            "What investments are considered halal in Islam?",
            "How do I screen stocks for Shariah compliance?",
            "Are cryptocurrency investments permissible?",
            "What are the best halal investment options available?"
        ],
        "banking": [
            "What's the difference between Islamic and conventional banking?",
            "How do Islamic mortgages work?",
            "What are Murabaha and Musharaka financing?",
            "Can I use conventional banks if no Islamic bank is available?"
        ],
        "business": [
            "How can I structure my business to be Shariah-compliant?",
            "Is profit and loss sharing required in partnerships?",
            "What business practices should I avoid in Islam?",
            "How do I handle interest-based supplier financing?"
        ]
    }
    
    logger.info(f"Conversation suggestions requested by user {current_user.id}")
    
    return {
        "suggestions": suggestions,
        "total_categories": len(suggestions),
        "timestamp": datetime.utcnow().isoformat()
    }

@router.delete("/conversation/{conversation_id}")
async def clear_conversation(
    conversation_id: str,
    current_user: User = Depends(get_current_user)
):
    """
    Clear conversation history for a specific conversation ID
    
    This removes the conversation context from memory, starting fresh.
    Useful when switching topics or when conversation becomes too long.
    """
    
    try:
        user_session_id = f"user_{current_user.id}_{conversation_id}"
        
        # Clear conversation from AI service memory
        if hasattr(islamic_finance_ai, 'conversation_memory'):
            if user_session_id in islamic_finance_ai.conversation_memory:
                del islamic_finance_ai.conversation_memory[user_session_id]
                logger.info(f"Conversation {conversation_id} cleared for user {current_user.id}")
                return {"message": "Conversation history cleared successfully"}
        
        return {"message": "No conversation history found to clear"}
        
    except Exception as e:
        logger.error(f"Error clearing conversation for user {current_user.id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to clear conversation history"
        )