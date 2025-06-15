
export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: string;
  source?: { title: string; url: string };
  widget?: 'zakat-calculator';
  actions?: ChatSuggestion[];
}

export interface ChatSuggestion {
  id: string;
  text: string;
}

export const initialMessages: ChatMessage[] = [
  {
    id: '1',
    text: 'As-salamu alaykum! Welcome to Nisab.AI. I am here to help you with your Islamic finance questions. How can I assist you today?',
    sender: 'bot',
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  },
];

export const initialSuggestions: ChatSuggestion[] = [
  { id: 's1', text: 'What are the advantages of using Nisab.AI?' },
  { id: 's2', text: 'How do I calculate my Zakat?' },
];

export const chatResponses: Record<string, ChatMessage[]> = {
  'What are the advantages of using Nisab.AI?': [
    {
      id: 'r-nisab-1',
      text: 'Nisab.AI is designed to provide you with clear and accessible information about Islamic finance. You can ask questions, get explanations of complex topics, and even get help with calculations like Zakat. My goal is to be your trusted guide in navigating your financial life according to Islamic principles.',
      sender: 'bot',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }
  ],
  'How do I calculate my Zakat?': [
    {
      id: 'r1-1',
      text: 'Zakat is calculated at 2.5% on your total wealth that you have owned for at least one lunar year, provided it is above the Nisab threshold.',
      sender: 'bot',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      source: { title: 'Zakat Foundation of America', url: '#' },
    },
    {
      id: 'r1-2',
      text: 'Would you like me to help you calculate it based on your assets like cash, gold, and investments?',
      sender: 'bot',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      actions: [
        { id: 'zakat-yes', text: 'Yes, help me calculate it' },
        { id: 'zakat-no', text: 'No, thank you' },
      ],
    },
  ],
  'Yes, help me calculate it': [
    {
        id: 'r-zakat-calc',
        text: "Of course. Please enter your assets in the calculator below. The values for Gold and Silver should be in grams. We'll use current market rates for calculation.",
        sender: 'bot',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        widget: 'zakat-calculator'
    }
  ],
  'No, thank you': [
    {
        id: 'r-zakat-no',
        text: "Alright. If you change your mind, just let me know. Is there anything else I can help you with?",
        sender: 'bot',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }
  ],
  'What are Halal investments?': [
    {
      id: 'r2-1',
      text: 'Halal investments are investments in companies that comply with Shariah principles. This means they do not engage in prohibited activities like lending with interest (Riba), gambling, or producing non-Halal goods like alcohol or pork.',
      sender: 'bot',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      source: { title: 'IslamicFinanceGuru', url: '#' },
    },
  ],
  'Explain Riba in simple terms.': [
    {
      id: 'r3-1',
      text: "Riba is any excess or increase on a loan or exchange. Simply put, it's interest. Islam prohibits Riba because it can lead to exploitation and social inequality.",
      sender: 'bot',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ],
  'default': [
    {
        id: 'def-1',
        text: "That's a great question. As an AI, I'm still learning. For specific queries, I recommend consulting with a qualified Islamic scholar. Would you like me to explain another topic, like Mudarabah (profit-sharing) or Sukuk (Islamic bonds)?",
        sender: 'bot',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }
  ]
};
