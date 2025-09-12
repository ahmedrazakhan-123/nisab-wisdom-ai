// API service for Islamic Finance chatbot
import { ChatMessage } from '@/lib/chat-types';

const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://your-api-domain.com/api/v1' 
  : 'http://localhost:8000/api/v1';

interface ChatRequest {
  message: string;
  conversation_id?: string;
  include_context?: boolean;
}

interface ChatAPIResponse {
  message: string;
  intent: string;
  status: string;
  model?: string;
  suggestions: string[];
  conversation_id: string;
  timestamp: string;
}

class ChatAPI {
  private getAuthToken(): string | null {
    return localStorage.getItem('auth_token') || localStorage.getItem('token');
  }

  private async makeRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = this.getAuthToken();
    
    const config: RequestInit = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
    };

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
      
      if (!response.ok) {
        if (response.status === 401) {
          // Clear invalid token
          localStorage.removeItem('auth_token');
          localStorage.removeItem('token');
          throw new Error('Authentication required. Please log in.');
        }
        
        if (response.status === 429) {
          throw new Error('Too many requests. Please wait a moment before trying again.');
        }
        
        if (response.status === 503) {
          throw new Error('AI service temporarily unavailable. Please try again shortly.');
        }
        
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `Request failed with status ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Network error. Please check your connection and try again.');
    }
  }

  async sendMessage(request: ChatRequest): Promise<ChatAPIResponse> {
    try {
      // Use the real backend API on port 8002
      const response = await fetch('http://localhost:8002/api/v1/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: request.message }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      // Convert backend response to expected format
      return {
        message: data.response,
        intent: 'islamic_finance',
        status: 'success',
        model: data.source === 'deepseek' ? 'DeepSeek AI' : 'Fallback',
        suggestions: [],
        conversation_id: `conv_${Date.now()}`,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error('Backend API error, using fallback:', error);
      return this.getFallbackResponse(request.message);
    }
  }

  async getHealthStatus(): Promise<any> {
    return this.makeRequest('/chat/health');
  }

  async getConversationSuggestions(): Promise<any> {
    return this.makeRequest('/chat/conversation-suggestions');
  }

  async clearConversation(conversationId: string): Promise<any> {
    return this.makeRequest(`/chat/conversation/${conversationId}`, {
      method: 'DELETE',
    });
  }

  // Fallback responses when AI is unavailable
  getFallbackResponse(userMessage: string): ChatAPIResponse {
    const lowerMessage = userMessage.toLowerCase();
    
    let fallbackMessage = '';
    let intent = 'general_islamic_finance';
    let suggestions: string[] = [];

    // Zakat-related questions
    if (lowerMessage.includes('zakat') || lowerMessage.includes('nisab') || lowerMessage.includes('charity')) {
      if (lowerMessage.includes('calculate') || lowerMessage.includes('how much')) {
        fallbackMessage = `**As-salamu alaykum!** For Zakat calculations, here's what you need to know:

**💰 Zakat Rate:** 2.5% annually on eligible wealth held for one lunar year

**📏 Nisab Thresholds:**
• **Gold:** 87.48 grams (≈20 mithqal)
• **Silver:** 612.36 grams (≈200 dirhams)
• Use our **Zakat Calculator** for precise calculations with current market prices!

**✅ Zakatable Assets:**
• Cash, savings, investments
• Gold, silver, jewelry (for trade)
• Business inventory and trade goods
• Stocks, mutual funds, crypto (if halal)

**❌ Exempt Assets:**
• Primary residence
• Personal car and household items
• Tools for profession/trade

**🧮 Quick Formula:** (Total Assets - Debts) × 2.5% = Zakat Due

Use our advanced Zakat Calculator for accurate calculations!`;
        suggestions = [
          "Open Zakat Calculator",
          "What counts as zakatable wealth?",
          "When is Zakat due?",
          "How to calculate nisab threshold?"
        ];
      } else if (lowerMessage.includes('nisab')) {
        fallbackMessage = `**Nisab Explained:**

Nisab is the minimum threshold of wealth that makes Zakat obligatory. It's based on the value of:

**🥇 Gold Standard:** 87.48 grams of gold
**🥈 Silver Standard:** 612.36 grams of silver

**📊 Current Practice:**
• Use the **lower value** between gold and silver nisab
• Most scholars recommend the silver nisab (more generous to the poor)
• Must be held for one complete lunar year (Hijri calendar)

**💡 Pro Tip:** Our Zakat Calculator automatically uses current market prices to determine the exact nisab threshold for you!`;
        suggestions = [
          "Calculate current nisab value",
          "Use Zakat Calculator",
          "What if my wealth fluctuates?",
          "Different types of wealth for Zakat"
        ];
      } else {
        fallbackMessage = `**Zakat: The Third Pillar of Islam**

Zakat purifies wealth and helps those in need. Here are the essentials:

**🕐 When:** Annually, after wealth exceeds nisab for one lunar year
**💰 How Much:** 2.5% of eligible wealth
**👥 Who Benefits:** Eight categories mentioned in Quran (9:60)

**📱 Use our Zakat Calculator** for precise calculations based on your specific situation and current market prices.`;
        suggestions = [
          "Calculate my Zakat",
          "What is nisab?",
          "Who receives Zakat?",
          "Different types of Zakat"
        ];
      }
      intent = 'zakat_guidance';
      
    // Investment-related questions
    } else if (lowerMessage.includes('invest') || lowerMessage.includes('halal') || lowerMessage.includes('stock') || lowerMessage.includes('fund')) {
      fallbackMessage = `**Halal Investment Principles:**

**✅ Shariah-Compliant Investments:**
• Stocks in halal businesses (no alcohol, gambling, pork, interest-based banking)
• Islamic mutual funds and ETFs
• Real estate (not for speculation)
• Gold and silver
• Shariah-compliant REITs and Sukuk

**❌ Avoid:**
• Interest-based investments (Riba)
• Companies with >33% debt ratio
• Businesses dealing in haram products
• Conventional bonds and insurance
• Excessive speculation/gambling

**🔍 Screening Criteria:**
• Business activity must be halal
• Debt-to-market cap ratio <33%
• Interest income <5% of total revenue
• Cash + interest-bearing securities <33%

**💡 Popular Platforms:** Wahed Invest, Amana Mutual Funds, Saturna Capital`;
      intent = 'investment_advice';
      suggestions = [
        "How to screen stocks for Shariah compliance?",
        "Best halal investment platforms",
        "Is cryptocurrency halal?",
        "Islamic banking vs conventional"
      ];
      
    // Banking-related questions
    } else if (lowerMessage.includes('bank') || lowerMessage.includes('loan') || lowerMessage.includes('mortgage') || lowerMessage.includes('murabaha')) {
      fallbackMessage = `**Islamic Banking Principles:**

**🏦 Key Differences from Conventional Banking:**
• No interest (Riba) - based on profit-sharing
• Asset-backed transactions
• Risk-sharing between bank and customer
• Shariah-compliant investments only

**📋 Islamic Financing Products:**
• **Murabaha:** Cost-plus financing (most common)
• **Ijara:** Islamic leasing
• **Mudaraba:** Profit-sharing partnership
• **Musharaka:** Joint venture/equity partnership
• **Sukuk:** Islamic bonds

**🏠 Islamic Home Financing:**
Instead of interest, the bank buys the property and either:
1. Sells it to you at a higher price (Murabaha)
2. Leases it to you with option to buy (Ijara)

**💳 Banking Services:** Most major banks now offer Islamic banking windows`;
      intent = 'banking_guidance';
      suggestions = [
        "Find Islamic banks near me",
        "How does Islamic mortgage work?",
        "Difference between Murabaha and conventional loan",
        "Is conventional banking ever allowed?"
      ];
      
    // Crypto-related questions
    } else if (lowerMessage.includes('crypto') || lowerMessage.includes('bitcoin') || lowerMessage.includes('ethereum')) {
      fallbackMessage = `**Cryptocurrency & Islam:**

**🤔 Scholarly Opinions Vary:**
Some scholars permit crypto while others have concerns. Key considerations:

**✅ Potential Arguments for Permissibility:**
• Has intrinsic utility (store of value, medium of exchange)
• Not backed by interest-based system
• Decentralized nature

**⚠️ Concerns Raised:**
• Excessive speculation (gambling-like)
• Lack of intrinsic value
• Use in illegal activities
• Extreme volatility

**📝 General Guidelines if Investing:**
• Avoid coins linked to haram activities
• Don't leverage/borrow to invest
• Treat as long-term investment, not day trading
• Pay Zakat on holdings if they meet nisab

**🎓 Recommendation:** Consult knowledgeable Islamic scholars for your specific situation.`;
      intent = 'investment_advice';
      suggestions = [
        "Which cryptocurrencies might be more acceptable?",
        "How to calculate Zakat on crypto?",
        "Is crypto trading halal?",
        "Alternative halal investments"
      ];
      
    // Business-related questions
    } else if (lowerMessage.includes('business') || lowerMessage.includes('partnership') || lowerMessage.includes('profit')) {
      fallbackMessage = `**Islamic Business Principles:**

**✅ Halal Business Practices:**
• Fair dealing and honesty
• Clear contracts and transparency
• Avoiding deception or fraud
• Profit and loss sharing
• No exploitation or harm

**🤝 Partnership Types:**
• **Musharaka:** Equity partnership with shared profits/losses
• **Mudaraba:** One provides capital, other provides labor
• **Wakala:** Agency-based arrangement

**📋 Key Requirements:**
• All activities must be halal
• No interest-based financing
• Fair treatment of employees
• Ethical marketing and sales
• Proper Zakat payment on business assets

**⚖️ Dispute Resolution:** Prefer arbitration following Islamic principles`;
      intent = 'business_guidance';
      suggestions = [
        "How to structure an Islamic partnership?",
        "Calculating Zakat on business assets",
        "Dealing with non-Muslim business partners",
        "Islamic business ethics"
      ];
      
    // General Islamic finance questions
    } else {
      fallbackMessage = `**As-salamu alaykum wa rahmatullahi wa barakatuh!** 

I'm your Islamic Finance assistant. I can help you with:

**💰 Zakat & Charity:**
• Calculations and obligations
• Nisab thresholds
• Different types of wealth

**📈 Halal Investments:**
• Shariah-compliant screening
• Islamic funds and stocks
• Real estate and commodities

**🏦 Islamic Banking:**
• Murabaha, Ijara, Mudaraba
• Islamic mortgages
• Banking alternatives

**💼 Business & Finance:**
• Islamic business structures
• Avoiding Riba (interest)
• Ethical financial practices

**🤲 Ask me specific questions** about any Islamic finance topic, or use our **Zakat Calculator** for immediate calculations!`;
      suggestions = [
        "Calculate my Zakat obligation",
        "What investments are halal?",
        "How does Islamic banking work?",
        "Explain Riba and how to avoid it"
      ];
    }

    return {
      message: fallbackMessage,
      intent,
      status: 'success',
      model: 'islamic_finance_expert',
      suggestions,
      conversation_id: 'local_session',
      timestamp: new Date().toISOString()
    };
  }
}

export const chatAPI = new ChatAPI();
export type { ChatRequest, ChatAPIResponse };