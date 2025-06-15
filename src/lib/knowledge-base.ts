
import { KnowledgeBaseEntry, ChatSuggestion, BotResponse } from './chat-types';

export const initialSuggestions: ChatSuggestion[] = [
  { id: 's1', text: 'What are the advantages of using Nisab.AI?' },
  { id: 's2', text: 'How do I calculate my Zakat?' },
  { id: 's3', text: 'What are Halal investments?' },
];

export const knowledgeBase: KnowledgeBaseEntry[] = [
  {
    id: 'kb-1',
    category: 'General',
    keywords: ['advantages', 'nisab.ai', 'about this app', 'what is this'],
    responses: [
      {
        text: 'Nisab.AI is designed to provide you with clear and accessible information about Islamic finance. You can ask questions, get explanations of complex topics, and even get help with calculations like Zakat. My goal is to be your trusted guide in navigating your financial life according to Islamic principles.',
      },
    ],
  },
  {
    id: 'kb-2',
    category: 'Zakat',
    keywords: ['zakat', 'calculate', 'how do i calculate my zakat?'],
    responses: [
      {
        text: 'Zakat is calculated at 2.5% on your total wealth that you have owned for at least one lunar year, provided it is above the Nisab threshold.',
        source: { title: 'Zakat Foundation of America', url: '#' },
      },
      {
        text: 'Would you like me to help you calculate it based on your assets like cash, gold, and investments?',
        actions: [
          { id: 'zakat-yes', text: 'Yes, help me calculate it' },
          { id: 'zakat-no', text: 'No, thank you' },
        ],
      },
    ],
  },
  {
    id: 'kb-3',
    category: 'Zakat',
    keywords: ['yes, help me calculate it'],
    responses: [
      {
        text: "Great! Our dedicated Zakat Calculator page provides a comprehensive tool for this. Please use the link below to proceed.",
        source: { title: 'Open Zakat Calculator', url: '/zakat-calculator' },
      },
    ],
  },
  {
    id: 'kb-4',
    category: 'General',
    keywords: ['no, thank you'],
    responses: [
      {
        text: 'Alright. If you change your mind, just let me know. Is there anything else I can help you with?',
      },
    ],
  },
  {
    id: 'kb-5',
    category: 'Investments',
    keywords: ['halal', 'investments', 'investing', 'what are halal investments?'],
    responses: [
      {
        text: 'Halal investments are investments in companies that comply with Shariah principles. This means they do not engage in prohibited activities like lending with interest (Riba), gambling, or producing non-Halal goods like alcohol or pork.',
        source: { title: 'IslamicFinanceGuru', url: '#' },
      },
    ],
  },
  {
    id: 'kb-6',
    category: 'Finance Concepts',
    keywords: ['riba', 'interest', 'explain riba'],
    responses: [
      {
        text: "Riba is any excess or increase on a loan or exchange. Simply put, it's interest. Islam prohibits Riba because it can lead to exploitation and social inequality.",
      },
    ],
  },
];

export const defaultResponse: KnowledgeBaseEntry = {
  id: 'kb-default',
  category: 'Default',
  keywords: [],
  responses: [
    {
      text: "That's a great question. As an AI, I'm still learning. For specific queries, I recommend consulting with a qualified Islamic scholar. Would you like me to explain another topic, like Mudarabah (profit-sharing) or Sukuk (Islamic bonds)?",
    },
  ],
};
