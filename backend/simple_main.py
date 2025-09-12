"""Simple FastAPI backend for Islamic Finance AI Chatbot"""
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import httpx
import asyncio

app = FastAPI(title="Nisab Wisdom AI", version="1.0.0")

# CORS - Fix preflight requests - ADD PORT 8082
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8081", "http://localhost:8082", "http://localhost:3000", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)

# DeepSeek API configuration
DEEPSEEK_API_KEY = "sk-118c2c1efcb44aee89d9d2313c0d3436"  # Replace with real key
DEEPSEEK_BASE_URL = "https://api.deepseek.com"

class ChatMessage(BaseModel):
    message: str

class ChatResponse(BaseModel):
    response: str
    source: str = "deepseek"

@app.get("/")
async def root():
    return {"message": "Nisab Wisdom AI Backend - Islamic Finance Chatbot"}

@app.get("/health")
async def health():
    return {"status": "healthy", "service": "nisab-wisdom-ai"}

@app.options("/api/v1/chat")
async def chat_options():
    return {"message": "OK"}

@app.post("/api/v1/chat", response_model=ChatResponse)
async def chat_with_ai(message: ChatMessage):
    """Chat with DeepSeek AI for Islamic Finance questions"""
    
    print(f"🔍 Received message: {message.message}")
    print(f"🔑 Using API key: {DEEPSEEK_API_KEY[:10]}...")
    
    try:
        # Islamic Finance system prompt
        system_prompt = """You are an Islamic Finance expert AI assistant. Provide accurate, Shariah-compliant guidance on:
- Zakat calculations and obligations
- Halal investment screening
- Islamic banking principles (Murabaha, Ijara, Mudaraba)
- Cryptocurrency permissibility
- Business ethics in Islam

Always cite relevant Islamic principles and be clear about what is halal vs haram."""

        async with httpx.AsyncClient() as client:
            payload = {
                "model": "deepseek-chat",
                "messages": [
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": message.message}
                ],
                "max_tokens": 1500,
                "temperature": 0.7
            }
            
            headers = {
                "Authorization": f"Bearer {DEEPSEEK_API_KEY}",
                "Content-Type": "application/json"
            }
            
            print(f"🚀 Calling DeepSeek API...")
            response = await client.post(
                DEEPSEEK_BASE_URL,
                json=payload,
                headers=headers,
                timeout=30.0
            )
            
            print(f"📡 DeepSeek response status: {response.status_code}")
            
            if response.status_code == 200:
                result = response.json()
                ai_response = result["choices"][0]["message"]["content"]
                print(f"✅ DeepSeek AI response received!")
                return ChatResponse(response=ai_response, source="deepseek")
            else:
                print(f"❌ DeepSeek API failed with status {response.status_code}")
                print(f"Response: {response.text}")
                # Fallback response if API fails
                fallback = get_fallback_response(message.message.lower())
                return ChatResponse(response=fallback, source="fallback")
                
    except Exception as e:
        print(f"💥 Exception calling DeepSeek API: {e}")
        # Use fallback on any error
        fallback = get_fallback_response(message.message.lower())
        return ChatResponse(response=fallback, source="fallback")

def get_fallback_response(query: str) -> str:
    """Comprehensive Islamic Finance fallback responses"""
    
    if any(word in query for word in ["zakat", "nisab", "charity"]):
        return """**Zakat Calculation Guidance:**

📊 **Current Nisab (2025):**
- Gold: 85 grams (≈ $5,500 USD)
- Silver: 595 grams (≈ $400 USD)

💰 **Zakat Rate:** 2.5% of savings held for one lunar year

✅ **Assets Subject to Zakat:**
- Cash, bank savings, investments
- Gold, silver, cryptocurrency
- Business inventory and profits
- Stocks and mutual funds

❌ **Exempt Assets:**
- Primary residence, personal car
- Work tools, household items
- Pension funds (401k, etc.)

Calculate: (Total zakatable assets - debts) × 2.5% if above nisab"""

    elif any(word in query for word in ["halal", "investment", "stock", "shares"]):
        return """**Halal Investment Guidelines:**

✅ **Permissible Sectors:**
- Technology, healthcare, education
- Renewable energy, infrastructure
- Halal food, Islamic finance
- Real estate (non-speculative)

❌ **Prohibited Sectors:**
- Alcohol, gambling, tobacco
- Conventional banking, insurance
- Pork-related businesses
- Adult entertainment, weapons

🔍 **Screening Criteria:**
- Debt-to-equity ratio < 33%
- Interest income < 5% of total
- Cash/interest-bearing assets < 33%
- No prohibited business activities

📈 **Recommended:** Shariah-compliant ETFs, Islamic mutual funds"""

    elif any(word in query for word in ["bitcoin", "crypto", "ethereum", "blockchain"]):
        return """**Cryptocurrency in Islam:**

✅ **Generally Permissible:**
- Bitcoin, Ethereum (utility-based)
- Stablecoins for transactions
- Long-term holding (not speculation)
- Blockchain technology projects

⚠️ **Conditions for Permissibility:**
- Must have genuine utility/value
- Avoid excessive speculation (gambling)
- No interest-based lending (DeFi caution)
- Comply with local regulations

❌ **Avoid:**
- Meme coins, pump-and-dump schemes
- Interest-bearing crypto lending
- Gambling-based tokens
- Excessive day trading

💡 **Recommendation:** Consult local scholars for specific cases"""

    elif any(word in query for word in ["banking", "loan", "mortgage", "finance"]):
        return """**Islamic Banking Principles:**

🏛️ **Core Principles:**
- No Riba (interest/usury)
- No Gharar (excessive uncertainty)
- No Maysir (gambling/speculation)
- Asset-backed transactions

✅ **Islamic Finance Products:**
- **Murabaha:** Cost-plus financing
- **Ijara:** Islamic leasing
- **Mudaraba:** Profit-sharing partnership
- **Musharaka:** Joint venture financing

🏠 **Islamic Mortgages:**
- Diminishing Musharaka
- Ijara wa Iqtina (lease-to-own)
- Murabaha home financing

💳 **Banking:** Use Islamic banks or Shariah-compliant accounts"""

    else:
        return """**Islamic Finance Principles:**

Welcome to Nisab Wisdom AI! I can help with:

📿 **Zakat & Charity:** Calculations, nisab values, distribution
💰 **Halal Investing:** Stock screening, Islamic funds, real estate
₿ **Cryptocurrency:** Permissibility, guidelines, scholar opinions
🏦 **Islamic Banking:** Shariah-compliant financing, avoiding riba
📊 **Business Ethics:** Partnership rules, contract principles

Ask me specific questions about any Islamic finance topic!

*All guidance based on mainstream scholarly opinions. Consult local scholars for specific situations.*"""

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8002)