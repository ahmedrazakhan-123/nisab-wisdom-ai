import httpx
import asyncio
import json

# Test DeepSeek API directly
DEEPSEEK_API_KEY = "sk-118c2c1efcb44aee89d9d2313c0d3436"
DEEPSEEK_BASE_URL = "https://api.deepseek.com/v1/chat/completions"

async def test_deepseek():
    print("🧪 Testing DeepSeek API directly...")
    
    try:
        async with httpx.AsyncClient() as client:
            payload = {
                "model": "deepseek-chat",
                "messages": [
                    {"role": "system", "content": "You are an Islamic Finance expert."},
                    {"role": "user", "content": "How do I calculate Zakat?"}
                ],
                "max_tokens": 100,
                "temperature": 0.7
            }
            
            headers = {
                "Authorization": f"Bearer {DEEPSEEK_API_KEY}",
                "Content-Type": "application/json"
            }
            
            print(f"🔑 API Key: {DEEPSEEK_API_KEY[:10]}...")
            print(f"🎯 URL: {DEEPSEEK_BASE_URL}")
            
            response = await client.post(
                DEEPSEEK_BASE_URL,
                json=payload,
                headers=headers,
                timeout=30.0
            )
            
            print(f"📡 Status Code: {response.status_code}")
            print(f"📄 Response Headers: {dict(response.headers)}")
            
            if response.status_code == 200:
                result = response.json()
                print("✅ SUCCESS! DeepSeek API is working!")
                print(f"🤖 AI Response: {result['choices'][0]['message']['content']}")
            else:
                print(f"❌ FAILED! Status: {response.status_code}")
                print(f"Error response: {response.text}")
                
    except Exception as e:
        print(f"💥 Exception: {e}")

if __name__ == "__main__":
    asyncio.run(test_deepseek())