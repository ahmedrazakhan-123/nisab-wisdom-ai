
export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: string;
  source?: { title: string; url: string };
}

export interface ChatSuggestion {
  id: string;
  text: string;
  icon: string;
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
  { id: 's1', text: 'How do I calculate my Zakat?', icon: 'Calculator' },
  { id: 's2', text: 'What are Halal investments?', icon: 'Landmark' },
  { id: 's3', text: 'Explain Riba in simple terms.', icon: 'Scale' },
];

export const chatResponses: Record<string, ChatMessage[]> = {
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
    },
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
