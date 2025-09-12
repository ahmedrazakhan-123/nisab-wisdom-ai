"""
Islamic Finance Chatbot Test Script
Tests the complete AI chatbot functionality
"""

import asyncio
import httpx
import json
from typing import Dict, Any

class ChatbotTester:
    def __init__(self, base_url: str = "http://localhost:8000"):
        self.base_url = base_url
        self.token = None
        
    async def register_and_login(self) -> bool:
        """Register a test user and get authentication token"""
        
        async with httpx.AsyncClient() as client:
            # Register test user
            register_data = {
                "email": "chatbot.test@nisab.com",
                "password": "SecureTest123!",
                "full_name": "Chatbot Tester"
            }
            
            try:
                register_response = await client.post(
                    f"{self.base_url}/api/v1/auth/register",
                    json=register_data
                )
                
                if register_response.status_code not in [200, 409]:  # 409 = user exists
                    print(f"Registration failed: {register_response.status_code}")
                    return False
                
                # Login to get token
                login_data = {
                    "email": register_data["email"],
                    "password": register_data["password"]
                }
                
                login_response = await client.post(
                    f"{self.base_url}/api/v1/auth/login",
                    json=login_data
                )
                
                if login_response.status_code != 200:
                    print(f"Login failed: {login_response.status_code}")
                    return False
                
                login_result = login_response.json()
                self.token = login_result.get("access_token")
                print("✅ Authentication successful")
                return True
                
            except Exception as e:
                print(f"❌ Authentication error: {e}")
                return False
    
    async def test_chat_health(self) -> bool:
        """Test the chat health endpoint"""
        
        if not self.token:
            print("❌ No authentication token")
            return False
        
        async with httpx.AsyncClient() as client:
            try:
                response = await client.get(
                    f"{self.base_url}/api/v1/chat/health",
                    headers={"Authorization": f"Bearer {self.token}"}
                )
                
                if response.status_code == 200:
                    health_data = response.json()
                    print(f"✅ Chat health check: {health_data['status']}")
                    return True
                else:
                    print(f"❌ Health check failed: {response.status_code}")
                    return False
                    
            except Exception as e:
                print(f"❌ Health check error: {e}")
                return False
    
    async def test_islamic_finance_chat(self, message: str) -> Dict[str, Any]:
        """Test the Islamic finance chat endpoint"""
        
        if not self.token:
            print("❌ No authentication token")
            return {}
        
        async with httpx.AsyncClient(timeout=60.0) as client:
            try:
                chat_data = {
                    "message": message,
                    "conversation_id": "test-conversation",
                    "include_context": True
                }
                
                response = await client.post(
                    f"{self.base_url}/api/v1/chat/islamic-finance",
                    json=chat_data,
                    headers={"Authorization": f"Bearer {self.token}"}
                )
                
                if response.status_code == 200:
                    chat_result = response.json()
                    print(f"✅ Chat response received")
                    print(f"   Intent: {chat_result.get('intent')}")
                    print(f"   Status: {chat_result.get('status')}")
                    print(f"   Response: {chat_result.get('message', '')[:100]}...")
                    return chat_result
                else:
                    print(f"❌ Chat failed: {response.status_code}")
                    print(f"   Error: {response.text}")
                    return {}
                    
            except Exception as e:
                print(f"❌ Chat error: {e}")
                return {}
    
    async def run_comprehensive_test(self):
        """Run all chatbot tests"""
        
        print("🧪 Starting Islamic Finance Chatbot Tests")
        print("=" * 50)
        
        # Test 1: Authentication
        print("\n1. Testing Authentication...")
        auth_success = await self.register_and_login()
        if not auth_success:
            print("❌ Cannot proceed without authentication")
            return
        
        # Test 2: Health Check
        print("\n2. Testing Chat Service Health...")
        health_success = await self.test_chat_health()
        
        # Test 3: Zakat Question
        print("\n3. Testing Zakat Question...")
        zakat_response = await self.test_islamic_finance_chat(
            "How do I calculate Zakat on my savings of $50,000?"
        )
        
        # Test 4: Investment Question  
        print("\n4. Testing Investment Question...")
        investment_response = await self.test_islamic_finance_chat(
            "Are Tesla stocks halal for Muslim investors?"
        )
        
        # Test 5: Banking Question
        print("\n5. Testing Islamic Banking Question...")
        banking_response = await self.test_islamic_finance_chat(
            "What's the difference between Murabaha and conventional loans?"
        )
        
        # Test 6: Off-topic Question
        print("\n6. Testing Off-topic Question...")
        offtopic_response = await self.test_islamic_finance_chat(
            "What's the weather like today?"
        )
        
        # Summary
        print("\n" + "=" * 50)
        print("🏁 Test Summary:")
        print(f"   Authentication: {'✅' if auth_success else '❌'}")
        print(f"   Health Check: {'✅' if health_success else '❌'}")
        print(f"   Zakat Response: {'✅' if zakat_response else '❌'}")
        print(f"   Investment Response: {'✅' if investment_response else '❌'}")
        print(f"   Banking Response: {'✅' if banking_response else '❌'}")
        print(f"   Off-topic Handling: {'✅' if offtopic_response.get('intent') == 'off_topic' else '❌'}")

if __name__ == "__main__":
    # Run the tests
    tester = ChatbotTester()
    asyncio.run(tester.run_comprehensive_test())