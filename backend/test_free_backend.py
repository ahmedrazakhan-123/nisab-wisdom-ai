import httpx
import asyncio

async def test_free_backend():
    print("🧪 Testing our free AI backend...")
    
    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(
                "http://localhost:8002/api/v1/chat",
                json={"message": "How do I calculate Zakat on $5000?"},
                timeout=30.0
            )
            
            print(f"📡 Status: {response.status_code}")
            
            if response.status_code == 200:
                result = response.json()
                print("✅ SUCCESS!")
                print(f"🤖 Response: {result['response'][:200]}...")
                print(f"📍 Source: {result['source']}")
            else:
                print(f"❌ Failed: {response.text}")
                
    except Exception as e:
        print(f"💥 Error: {e}")

if __name__ == "__main__":
    asyncio.run(test_free_backend())