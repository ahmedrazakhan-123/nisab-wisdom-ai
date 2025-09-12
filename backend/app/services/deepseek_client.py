"""
DeepSeek API client for Islamic Finance AI
Provides secure, rate-limited access to DeepSeek's AI models
"""

import httpx
import json
from typing import List, Dict, Optional, Union
from app.core.config import settings
import logging
import asyncio
from datetime import datetime, timedelta

logger = logging.getLogger(__name__)

class DeepSeekError(Exception):
    """Custom exception for DeepSeek API errors"""
    pass

class DeepSeekClient:
    def __init__(self):
        self.api_key = getattr(settings, 'DEEPSEEK_API_KEY', None)
        self.base_url = "https://api.deepseek.com/v1"
        self.model = "deepseek-chat"
        self.max_retries = 3
        self.retry_delay = 1.0
        
        if not self.api_key:
            logger.warning("DeepSeek API key not configured. Chat functionality will be limited.")
    
    async def _make_request(
        self, 
        endpoint: str, 
        payload: Dict,
        timeout: float = 30.0
    ) -> Dict:
        """Make HTTP request to DeepSeek API with retry logic"""
        
        if not self.api_key:
            raise DeepSeekError("DeepSeek API key not configured")
        
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json",
            "User-Agent": "Nisab-Wisdom-AI/1.0"
        }
        
        url = f"{self.base_url}/{endpoint}"
        
        for attempt in range(self.max_retries):
            try:
                async with httpx.AsyncClient(timeout=timeout) as client:
                    response = await client.post(url, headers=headers, json=payload)
                    
                    # Handle different response codes
                    if response.status_code == 200:
                        return response.json()
                    elif response.status_code == 429:
                        # Rate limit hit, wait and retry
                        wait_time = self.retry_delay * (2 ** attempt)
                        logger.warning(f"Rate limit hit, waiting {wait_time}s before retry")
                        await asyncio.sleep(wait_time)
                        continue
                    elif response.status_code == 401:
                        raise DeepSeekError("Invalid API key")
                    elif response.status_code == 400:
                        error_detail = response.json().get('error', {}).get('message', 'Bad request')
                        raise DeepSeekError(f"Bad request: {error_detail}")
                    else:
                        logger.error(f"DeepSeek API error: {response.status_code} - {response.text}")
                        raise DeepSeekError(f"API Error: {response.status_code}")
                        
            except httpx.TimeoutException:
                logger.error(f"DeepSeek API timeout (attempt {attempt + 1})")
                if attempt == self.max_retries - 1:
                    raise DeepSeekError("Request timeout after retries")
                await asyncio.sleep(self.retry_delay)
                
            except httpx.RequestError as e:
                logger.error(f"DeepSeek API request error: {str(e)}")
                if attempt == self.max_retries - 1:
                    raise DeepSeekError(f"Network error: {str(e)}")
                await asyncio.sleep(self.retry_delay)
        
        raise DeepSeekError("Max retries exceeded")

    async def chat_completion(
        self, 
        messages: List[Dict[str, str]], 
        temperature: float = 0.7,
        max_tokens: int = 1500,
        stream: bool = False
    ) -> Dict:
        """
        Send chat completion request to DeepSeek API
        
        Args:
            messages: List of message objects with 'role' and 'content'
            temperature: Controls randomness (0.0 to 1.0)
            max_tokens: Maximum tokens to generate
            stream: Whether to stream the response
            
        Returns:
            Dict with response data or error information
        """
        
        # Validate inputs
        if not messages:
            raise DeepSeekError("Messages list cannot be empty")
        
        if not all(isinstance(msg, dict) and 'role' in msg and 'content' in msg for msg in messages):
            raise DeepSeekError("Invalid message format")
        
        if temperature < 0.0 or temperature > 1.0:
            raise DeepSeekError("Temperature must be between 0.0 and 1.0")
        
        if max_tokens < 1 or max_tokens > 4000:
            raise DeepSeekError("Max tokens must be between 1 and 4000")
        
        payload = {
            "model": self.model,
            "messages": messages,
            "temperature": temperature,
            "max_tokens": max_tokens,
            "stream": stream,
            "top_p": 0.9,
            "frequency_penalty": 0.1,
            "presence_penalty": 0.1
        }
        
        try:
            result = await self._make_request("chat/completions", payload)
            
            # Validate response structure
            if "choices" not in result or not result["choices"]:
                raise DeepSeekError("Invalid response format from API")
            
            return result
            
        except Exception as e:
            logger.error(f"DeepSeek chat completion error: {str(e)}")
            raise DeepSeekError(f"Chat completion failed: {str(e)}")

    async def health_check(self) -> Dict[str, Union[str, bool]]:
        """Check if DeepSeek API is accessible"""
        
        if not self.api_key:
            return {
                "status": "unhealthy",
                "reason": "API key not configured",
                "available": False
            }
        
        try:
            # Send minimal test request
            test_messages = [
                {"role": "user", "content": "Hello"}
            ]
            
            result = await self.chat_completion(
                messages=test_messages,
                temperature=0.1,
                max_tokens=10
            )
            
            return {
                "status": "healthy",
                "model": self.model,
                "available": True,
                "response_time": "OK"
            }
            
        except Exception as e:
            return {
                "status": "unhealthy", 
                "reason": str(e),
                "available": False
            }

    def estimate_tokens(self, text: str) -> int:
        """Rough estimation of token count for text"""
        # Approximate: 1 token ≈ 4 characters for English text
        return len(text) // 4

    def validate_conversation_length(self, messages: List[Dict]) -> bool:
        """Check if conversation is within token limits"""
        total_tokens = sum(self.estimate_tokens(msg.get('content', '')) for msg in messages)
        return total_tokens < 3000  # Leave room for response

# Global instance
deepseek_client = DeepSeekClient()