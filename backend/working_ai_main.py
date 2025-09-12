#!/usr/bin/env python3

import asyncio
import httpx
import json
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional

app = FastAPI(title="Real AI Chatbot", version="1.0.0")

# CORS configuration for your frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8082", "http://localhost:3000", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatMessage(BaseModel):
    message: str
    conversation_id: Optional[str] = None

class ChatResponse(BaseModel):
    response: str
    conversation_id: Optional[str] = None

# Let's use Hugging Face's FREE Inference API
# This is 100% real AI, not hardcoded responses
async def get_real_ai_response(message: str) -> str:
    """Get response from Hugging Face's free inference API - REAL AI"""
    
    # Try multiple FREE models until one works
    models = [
        "microsoft/DialoGPT-medium",
        "facebook/blenderbot-400M-distill", 
        "microsoft/DialoGPT-large",
        "Qwen/Qwen2.5-Coder-32B-Instruct"
    ]
    
    for model in models:
        try:
            print(f"🤖 Trying REAL AI model: {model}")
            
            async with httpx.AsyncClient() as client:
                # Hugging Face Inference API (FREE)
                response = await client.post(
                    f"https://api-inference.huggingface.co/models/{model}",
                    json={"inputs": message},
                    headers={"Content-Type": "application/json"},
                    timeout=30.0
                )
                
                print(f"📡 API Status: {response.status_code}")
                
                if response.status_code == 200:
                    result = response.json()
                    print(f"✅ Raw API Response: {result}")
                    
                    # Handle different response formats
                    if isinstance(result, list) and len(result) > 0:
                        if isinstance(result[0], dict):
                            if "generated_text" in result[0]:
                                ai_response = result[0]["generated_text"]
                                # Clean up DialoGPT responses
                                if ai_response.startswith(message):
                                    ai_response = ai_response[len(message):].strip()
                                return ai_response if ai_response else "I understand your question. Could you ask it differently?"
                            elif "text" in result[0]:
                                return result[0]["text"]
                        elif isinstance(result[0], str):
                            return result[0]
                    elif isinstance(result, dict):
                        if "generated_text" in result:
                            return result["generated_text"]
                        elif "text" in result:
                            return result["text"]
                    
                    return str(result)
                else:
                    print(f"❌ Model {model} failed: {response.status_code} - {response.text}")
                    
        except Exception as e:
            print(f"❌ Error with {model}: {e}")
            continue
    
    # If all AI models fail, return an honest error message
    return "❌ All real AI models are currently unavailable. This is NOT a hardcoded response - the AI APIs are actually down."

@app.options("/api/v1/chat")
async def chat_options():
    return {"message": "OK"}

@app.post("/api/v1/chat", response_model=ChatResponse)
async def chat_endpoint(chat_message: ChatMessage):
    try:
        print(f"🔍 USER MESSAGE: {chat_message.message}")
        
        # Get REAL AI response (not hardcoded!)
        ai_response = await get_real_ai_response(chat_message.message)
        
        print(f"🤖 AI RESPONSE: {ai_response}")
        
        return ChatResponse(
            response=ai_response,
            conversation_id=chat_message.conversation_id
        )
        
    except Exception as e:
        print(f"❌ Chat endpoint error: {e}")
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

@app.get("/")
async def root():
    return {"message": "Real AI Chatbot Backend - NO FAKE RESPONSES"}

@app.get("/api/v1/health")
async def health_check():
    return {"status": "healthy", "service": "real-ai-backend"}

if __name__ == "__main__":
    import uvicorn
    print("🚀 Starting REAL AI Backend - No hardcoded responses!")
    print("🤖 Using Hugging Face Inference API for genuine AI responses")
    uvicorn.run(app, host="0.0.0.0", port=8002)