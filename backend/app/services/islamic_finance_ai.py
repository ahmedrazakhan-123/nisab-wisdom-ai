"""
Islamic Finance AI Service
Specialized AI assistant for Shariah-compliant financial guidance
"""

from typing import List, Dict, Optional, Tuple
from .deepseek_client import deepseek_client, DeepSeekError
import logging
import re
from datetime import datetime
import json

logger = logging.getLogger(__name__)

class IslamicFinanceAI:
    def __init__(self):
        self.system_prompt = self._build_system_prompt()
        self.conversation_memory = {}  # Simple in-memory storage
        self.max_conversation_length = 10  # Keep last 5 exchanges
        
    def _build_system_prompt(self) -> str:
        """Build comprehensive system prompt for Islamic Finance expertise"""
        return """You are Dr. Ahmad, a renowned Islamic Finance Scholar and AI Assistant for Nisab Wisdom AI.

🕌 **YOUR EXPERTISE:**
- **Zakat & Charity**: Calculation methods, nisab thresholds, asset classification
- **Halal Investments**: Shariah-compliant stocks, funds, real estate, crypto
- **Islamic Banking**: Murabaha, Mudaraba, Musharaka, Ijarah, Sukuk
- **Business Ethics**: Halal business practices, partnership structures
- **Personal Finance**: Budgeting, savings, debt management (Islamic way)
- **Insurance**: Takaful vs conventional insurance
- **Modern Finance**: Islamic fintech, digital banking, blockchain applications

📚 **SOURCES & METHODOLOGY:**
- Quran and authentic Hadith references
- Classical Islamic jurisprudence (Fiqh al-Muamalat)
- Fatwas from AAOIFI, IFSB, and major scholars
- Modern Islamic finance institutions' guidelines
- Different madhab perspectives when relevant

🎯 **RESPONSE GUIDELINES:**
1. **Be Precise**: Provide specific, actionable guidance
2. **Cite Sources**: Reference Quranic verses, Hadith, or scholar opinions when possible
3. **Consider Context**: Ask clarifying questions if needed
4. **Practical Solutions**: Offer real-world alternatives for non-compliant situations
5. **Respectful Tone**: Use Islamic greetings and maintain scholarly dignity
6. **Acknowledge Limits**: When unsure, recommend consulting qualified scholars

✅ **ZAKAT SPECIFICS:**
- Gold Nisab: 87.48 grams (≈ 20 mithqal)
- Silver Nisab: 612.36 grams (≈ 200 dirhams)
- Rate: 2.5% on wealth held for one lunar year
- Assets: Cash, gold, silver, business inventory, investments
- Exempt: Primary residence, personal items, tools of trade

🚫 **AVOID THESE:**
- Interest-based recommendations
- Conventional insurance suggestions
- Gambling or speculative investments
- Non-halal business models
- Vague or general financial advice without Islamic context

📋 **RESPONSE FORMAT:**
- Start with Islamic greeting when appropriate
- Use clear sections for complex topics
- Provide calculations for Zakat questions
- End with "May Allah grant you success in your financial endeavors" for comprehensive answers
- Include relevant du'as when contextually appropriate

Remember: You're helping Muslims navigate modern finance while staying true to Islamic principles."""

    def _classify_intent(self, message: str) -> str:
        """Classify the intent of the user's message"""
        message_lower = message.lower()
        
        zakat_keywords = ['zakat', 'nisab', 'charity', 'obligatory', '2.5%', 'lunar year']
        investment_keywords = ['invest', 'stock', 'fund', 'halal investment', 'haram', 'shariah compliant']
        banking_keywords = ['loan', 'mortgage', 'bank', 'murabaha', 'mudaraba', 'islamic bank']
        business_keywords = ['business', 'partnership', 'profit', 'loss sharing', 'musharaka']
        
        if any(keyword in message_lower for keyword in zakat_keywords):
            return "zakat_guidance"
        elif any(keyword in message_lower for keyword in investment_keywords):
            return "investment_advice"
        elif any(keyword in message_lower for keyword in banking_keywords):
            return "banking_guidance"
        elif any(keyword in message_lower for keyword in business_keywords):
            return "business_guidance"
        else:
            return "general_islamic_finance"

    def _is_islamic_finance_related(self, message: str) -> bool:
        """Check if the message is related to Islamic finance"""
        islamic_finance_keywords = [
            # Core Islamic finance terms
            'zakat', 'halal', 'haram', 'riba', 'interest', 'islamic', 'shariah', 'sharia',
            'sukuk', 'murabaha', 'mudaraba', 'musharaka', 'ijarah', 'takaful',
            
            # Financial terms
            'investment', 'bank', 'loan', 'mortgage', 'finance', 'money', 'wealth',
            'business', 'profit', 'loss', 'partnership', 'trade', 'nisab',
            'charity', 'donation', 'obligatory', 'voluntary',
            
            # Modern finance
            'crypto', 'bitcoin', 'stock', 'fund', 'etf', 'bond', 'insurance',
            'fintech', 'digital banking', 'online trading',
            
            # Islamic concepts
            'allah', 'quran', 'hadith', 'sunnah', 'prophet', 'scholar',
            'fatwa', 'jurisprudence', 'fiqh', 'madhab'
        ]
        
        message_lower = message.lower()
        return any(keyword in message_lower for keyword in islamic_finance_keywords)

    def _sanitize_input(self, message: str) -> str:
        """Sanitize user input to prevent injection attacks"""
        # Remove potentially harmful patterns
        sanitized = re.sub(r'[<>"\';\\]', '', message)
        sanitized = re.sub(r'\b(script|javascript|eval|exec)\b', '', sanitized, flags=re.IGNORECASE)
        return sanitized.strip()

    def _build_conversation_context(self, user_id: str) -> List[Dict[str, str]]:
        """Build conversation context from memory"""
        if user_id not in self.conversation_memory:
            return []
        
        conversation = self.conversation_memory[user_id]
        # Return last few exchanges to maintain context
        return conversation[-self.max_conversation_length:]

    def _store_conversation(self, user_id: str, user_message: str, ai_response: str):
        """Store conversation in memory"""
        if user_id not in self.conversation_memory:
            self.conversation_memory[user_id] = []
        
        self.conversation_memory[user_id].extend([
            {"role": "user", "content": user_message},
            {"role": "assistant", "content": ai_response}
        ])
        
        # Keep conversation manageable
        if len(self.conversation_memory[user_id]) > self.max_conversation_length * 2:
            self.conversation_memory[user_id] = self.conversation_memory[user_id][-self.max_conversation_length:]

    async def get_response(
        self, 
        user_message: str, 
        user_id: str = "anonymous",
        include_context: bool = True
    ) -> Dict[str, any]:
        """
        Get AI response for Islamic finance question
        
        Args:
            user_message: The user's question or message
            user_id: Unique identifier for conversation context
            include_context: Whether to include conversation history
            
        Returns:
            Dict containing response, metadata, and status
        """
        
        try:
            # Sanitize input
            clean_message = self._sanitize_input(user_message)
            
            if not clean_message:
                return {
                    "message": "I didn't receive a valid message. Please ask me about Islamic finance topics.",
                    "intent": "invalid_input",
                    "status": "error",
                    "suggestions": [
                        "How do I calculate Zakat on my savings?",
                        "What investments are Shariah-compliant?",
                        "Is cryptocurrency halal?"
                    ]
                }
            
            # Check if message is Islamic finance related
            if not self._is_islamic_finance_related(clean_message):
                return {
                    "message": "As-salamu alaykum! I specialize in Islamic finance and Shariah-compliant financial matters. Please ask questions about Zakat, halal investments, Islamic banking, or other Islamic finance topics. How can I help you with your Islamic financial needs?",
                    "intent": "off_topic",
                    "status": "redirected",
                    "suggestions": [
                        "Calculate Zakat on gold and silver",
                        "Find halal investment options",
                        "Learn about Islamic banking products",
                        "Understand riba and how to avoid it"
                    ]
                }
            
            # Build message context
            messages = [{"role": "system", "content": self.system_prompt}]
            
            # Add conversation history if requested
            if include_context:
                context = self._build_conversation_context(user_id)
                messages.extend(context)
            
            # Add current user message
            messages.append({"role": "user", "content": clean_message})
            
            # Validate conversation length
            if not deepseek_client.validate_conversation_length(messages):
                # Reset context if too long
                messages = [
                    {"role": "system", "content": self.system_prompt},
                    {"role": "user", "content": clean_message}
                ]
                logger.info(f"Conversation context reset for user {user_id} due to length")
            
            # Get AI response
            response = await deepseek_client.chat_completion(
                messages=messages,
                temperature=0.7,
                max_tokens=1500
            )
            
            # Extract and process response
            ai_message = response["choices"][0]["message"]["content"]
            intent = self._classify_intent(clean_message)
            
            # Store conversation
            self._store_conversation(user_id, clean_message, ai_message)
            
            # Generate contextual suggestions
            suggestions = self._generate_suggestions(intent)
            
            return {
                "message": ai_message,
                "intent": intent,
                "status": "success",
                "model": "deepseek-chat",
                "suggestions": suggestions,
                "conversation_id": user_id,
                "timestamp": datetime.utcnow().isoformat()
            }
            
        except DeepSeekError as e:
            logger.error(f"DeepSeek error for user {user_id}: {str(e)}")
            return {
                "message": "I apologize, but I'm experiencing technical difficulties with my AI service. Please try again in a moment, or feel free to use our Zakat calculator for immediate calculations.",
                "intent": "system_error",
                "status": "error",
                "error": str(e),
                "suggestions": [
                    "Try asking a simpler question",
                    "Use the Zakat Calculator",
                    "Contact support if the issue persists"
                ]
            }
            
        except Exception as e:
            logger.error(f"Unexpected error in Islamic Finance AI: {str(e)}")
            return {
                "message": "I apologize for the technical issue. Please try rephrasing your question or use our Zakat calculator for immediate assistance.",
                "intent": "unknown_error",
                "status": "error",
                "error": "System error",
                "suggestions": [
                    "Rephrase your question",
                    "Use the Zakat Calculator",
                    "Contact technical support"
                ]
            }

    def _generate_suggestions(self, intent: str) -> List[str]:
        """Generate contextual suggestions based on intent"""
        suggestions_map = {
            "zakat_guidance": [
                "Calculate Zakat on different asset types",
                "Learn about nisab thresholds",
                "Understand which assets require Zakat",
                "Find local Zakat distribution options"
            ],
            "investment_advice": [
                "Explore halal investment portfolios",
                "Learn about Shariah-compliant screening",
                "Understand Islamic investment principles",
                "Find halal mutual funds and ETFs"
            ],
            "banking_guidance": [
                "Compare Islamic vs conventional banking",
                "Learn about Islamic financing products",
                "Understand Murabaha and Musharaka",
                "Find Islamic banks in your area"
            ],
            "business_guidance": [
                "Structure Islamic business partnerships",
                "Understand profit and loss sharing",
                "Learn about Islamic business ethics",
                "Explore Islamic trade financing"
            ],
            "general_islamic_finance": [
                "Calculate your Zakat obligation",
                "Find halal investment options",
                "Learn Islamic banking basics",
                "Understand modern Islamic finance"
            ]
        }
        
        return suggestions_map.get(intent, suggestions_map["general_islamic_finance"])

    async def health_check(self) -> Dict[str, any]:
        """Check the health of the Islamic Finance AI service"""
        try:
            # Test the underlying DeepSeek client
            client_health = await deepseek_client.health_check()
            
            return {
                "service": "islamic_finance_ai",
                "status": "healthy" if client_health["available"] else "degraded",
                "deepseek_client": client_health,
                "system_prompt_loaded": bool(self.system_prompt),
                "conversation_memory_active": True,
                "timestamp": datetime.utcnow().isoformat()
            }
            
        except Exception as e:
            return {
                "service": "islamic_finance_ai",
                "status": "unhealthy",
                "error": str(e),
                "timestamp": datetime.utcnow().isoformat()
            }

# Global instance
islamic_finance_ai = IslamicFinanceAI()