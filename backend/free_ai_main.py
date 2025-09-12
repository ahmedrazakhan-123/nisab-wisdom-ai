"""Simple FastAPI backend with FREE AI APIs for Islamic Finance Chatbot"""
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

class ChatMessage(BaseModel):
    message: str

class ChatResponse(BaseModel):
    response: str
    source: str = "ai"

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
    """Chat with FREE AI APIs for Islamic Finance questions"""
    
    print(f"🔍 Received message: {message.message}")
    
    # Try multiple free AI APIs in order
    ai_response = await try_free_ai_apis(message.message)
    
    if ai_response:
        print(f"✅ AI response received!")
        return ChatResponse(response=ai_response, source="ai")
    else:
        print(f"🔄 Using local knowledge base")
        fallback = get_fallback_response(message.message.lower())
        return ChatResponse(response=fallback, source="local")

async def try_free_ai_apis(user_message: str) -> str:
    """Try multiple free AI APIs in sequence"""
    
    # Islamic Finance system prompt
    system_prompt = """You are an Islamic Finance expert AI assistant. Provide accurate, Shariah-compliant guidance on:
- Zakat calculations and obligations  
- Halal investment screening
- Islamic banking principles (Murabaha, Ijara, Mudaraba)
- Cryptocurrency permissibility
- Business ethics in Islam

Always cite relevant Islamic principles and be clear about what is halal vs haram."""

    # Try Hugging Face Inference API (free)
    try:
        print("🚀 Trying Hugging Face API...")
        async with httpx.AsyncClient() as client:
            response = await client.post(
                "https://api-inference.huggingface.co/models/microsoft/DialoGPT-large",
                headers={"Authorization": "Bearer hf_free"},  # Free tier
                json={"inputs": f"{system_prompt}\n\nUser: {user_message}\nAssistant:"},
                timeout=10.0
            )
            if response.status_code == 200:
                result = response.json()
                if isinstance(result, list) and len(result) > 0:
                    return result[0].get("generated_text", "").split("Assistant:")[-1].strip()
    except Exception as e:
        print(f"❌ Hugging Face failed: {e}")

    # Try OpenAI-compatible free endpoints
    free_endpoints = [
        "https://api.together.xyz/v1/chat/completions",  # Together AI (has free tier)
        "https://api.openai.com/v1/chat/completions",    # Fallback (if you add key later)
    ]
    
    for endpoint in free_endpoints:
        try:
            print(f"🚀 Trying {endpoint}...")
            async with httpx.AsyncClient() as client:
                payload = {
                    "model": "gpt-3.5-turbo",
                    "messages": [
                        {"role": "system", "content": system_prompt},
                        {"role": "user", "content": user_message}
                    ],
                    "max_tokens": 500,
                    "temperature": 0.7
                }
                
                response = await client.post(
                    endpoint,
                    json=payload,
                    headers={"Authorization": "Bearer free-trial"},
                    timeout=10.0
                )
                
                if response.status_code == 200:
                    result = response.json()
                    return result["choices"][0]["message"]["content"]
                    
        except Exception as e:
            print(f"❌ {endpoint} failed: {e}")
            continue
    
    return None  # All APIs failed, use fallback

def get_fallback_response(query: str) -> str:
    """Comprehensive Islamic Finance fallback responses"""
    
    # Always provide helpful response for greetings
    if any(word in query for word in ["hi", "hello", "hey", "how are you", "how r u", "gg", "test"]):
        return """**As-salaam alaikum! Welcome to Nisab Wisdom AI! 🕌**

I'm your Islamic Finance assistant, ready to help with:

📿 **Zakat Calculations:** How much you owe, nisab values, asset types
💰 **Halal Investing:** Stock screening, Islamic funds, crypto guidance  
🏦 **Islamic Banking:** Shariah-compliant loans, mortgages, financing
📊 **Business Ethics:** Partnerships, contracts, trade principles

**Try asking me:**
- "How do I calculate Zakat on $10,000?"
- "Is Tesla stock halal to invest in?"
- "Can I get an Islamic mortgage?"
- "Is Bitcoin permissible in Islam?"

What would you like to learn about Islamic finance today?"""

    elif any(word in query for word in ["zakat", "nisab", "charity"]):
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

**Formula:** (Total zakatable assets - debts) × 2.5% if above nisab

**Example:** $10,000 savings above nisab = $250 Zakat due"""
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

**Formula:** (Total zakatable assets - debts) × 2.5% if above nisab

**Example:** $10,000 savings above nisab = $250 Zakat due"""

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

📈 **Recommended:** Shariah-compliant ETFs, Islamic mutual funds, direct halal stock investments

**Popular Halal Stocks:** Apple, Microsoft, Tesla, Google (after screening)"""

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

💡 **Scholarly Opinion:** Most contemporary scholars permit Bitcoin and major cryptocurrencies when used as digital assets, not for speculation.

**Recommendation:** Long-term investment in established cryptocurrencies with real utility."""

    elif any(word in query for word in ["banking", "loan", "mortgage", "finance"]):
        return """**Islamic Banking Principles:**

🏛️ **Core Principles:**
- No Riba (interest/usury)
- No Gharar (excessive uncertainty)
- No Maysir (gambling/speculation)
- Asset-backed transactions

✅ **Islamic Finance Products:**
- **Murabaha:** Cost-plus financing (home, car purchases)
- **Ijara:** Islamic leasing
- **Mudaraba:** Profit-sharing partnership
- **Musharaka:** Joint venture financing

🏠 **Islamic Mortgages:**
- Diminishing Musharaka (co-ownership)
- Ijara wa Iqtina (lease-to-own)
- Murabaha home financing

🏦 **Islamic Banks in US:**
- University Bank, Guidance Residential
- Devon Bank, Lariba Bank
- Check local credit unions for Shariah-compliant products

💳 **Banking Tips:** Avoid interest-based accounts, use Islamic banks or dividend-paying accounts."""

    else:
        return """**Welcome to Islamic Finance Guidance! 🕌**

I'm here to help with Shariah-compliant financial decisions:

📿 **Zakat & Charity:** Calculations, nisab values, distribution
💰 **Halal Investing:** Stock screening, Islamic funds, real estate  
₿ **Cryptocurrency:** Permissibility, guidelines, scholarly opinions
🏦 **Islamic Banking:** Shariah-compliant financing, avoiding riba
📊 **Business Ethics:** Partnership rules, contract principles

**Ask me specific questions like:**
- "How much Zakat do I owe on $15,000?"
- "Is Apple stock halal to invest in?"
- "Can I get an Islamic mortgage?"
- "Is Bitcoin permissible in Islam?"

*All guidance based on mainstream scholarly opinions. Consult local scholars for specific situations.*"""

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8002)