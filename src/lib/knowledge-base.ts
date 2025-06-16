
import { KnowledgeBaseEntry, ChatSuggestion, BotResponse } from './chat-types';

export const initialSuggestions: ChatSuggestion[] = [
  { id: 's1', text: 'What are the advantages of using Nisab.AI?' },
  { id: 's2', text: 'How do I calculate my Zakat?' },
  { id: 's3', text: 'What are Halal investments?' },
  { id: 's4', text: 'Explain Riba in simple terms' },
  { id: 's5', text: 'What is Islamic banking?' },
];

// Enhanced keyword matching function
export const findBestMatch = (userInput: string, knowledgeBase: KnowledgeBaseEntry[]): KnowledgeBaseEntry | null => {
  const lowerCaseInput = userInput.toLowerCase();
  
  // First try exact matches
  const exactMatch = knowledgeBase.find(entry => 
    entry.keywords.some(keyword => lowerCaseInput === keyword.toLowerCase())
  );
  if (exactMatch) return exactMatch;

  // Then try partial matches with scoring
  let bestMatch: { entry: KnowledgeBaseEntry, score: number } | null = null;

  for (const entry of knowledgeBase) {
    let score = 0;
    
    entry.keywords.forEach(keyword => {
      const keywordLower = keyword.toLowerCase();
      
      // Exact keyword match
      if (lowerCaseInput.includes(keywordLower)) {
        score += 5;
      }
      
      // Partial word matches
      const inputWords = lowerCaseInput.split(' ');
      const keywordWords = keywordLower.split(' ');
      
      keywordWords.forEach(keywordWord => {
        inputWords.forEach(inputWord => {
          if (inputWord.includes(keywordWord) || keywordWord.includes(inputWord)) {
            score += 2;
          }
        });
      });
    });

    if (score > (bestMatch?.score ?? 0)) {
      bestMatch = { entry, score };
    }
  }

  return bestMatch && bestMatch.score >= 2 ? bestMatch.entry : null;
};

export const knowledgeBase: KnowledgeBaseEntry[] = [
  {
    id: 'kb-1',
    category: 'General',
    keywords: ['advantages', 'nisab.ai', 'about this app', 'what is this', 'about', 'benefits', 'why use'],
    responses: [
      {
        text: 'Assalamu alaikum! Nisab.AI is designed to provide you with clear and accessible information about Islamic finance. You can ask questions, get explanations of complex topics, and even get help with calculations like Zakat. My goal is to be your trusted guide in navigating your financial life according to Islamic principles, ensuring all guidance is Shariah-compliant.',
      },
    ],
  },
  {
    id: 'kb-2',
    category: 'Zakat',
    keywords: ['zakat', 'calculate', 'how do i calculate my zakat?', 'zakat calculation', 'charity', 'nisab'],
    responses: [
      {
        text: 'Zakat is one of the Five Pillars of Islam and is calculated at 2.5% on your total wealth that you have owned for at least one lunar year, provided it exceeds the Nisab threshold. The current Nisab is approximately 85 grams of gold or 595 grams of silver.',
        source: { title: 'Islamic Finance Guidelines', url: '#' },
      },
      {
        text: 'Would you like me to help you calculate your Zakat using our comprehensive calculator?',
        actions: [
          { id: 'zakat-yes', text: 'Yes, help me calculate it' },
          { id: 'zakat-no', text: 'Tell me more about Zakat rules' },
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
        text: "Excellent! Our dedicated Zakat Calculator provides a comprehensive tool that considers all your assets including cash, gold, silver, investments, and business assets. It will guide you through each step.",
        source: { title: 'Open Zakat Calculator', url: '/zakat-calculator' },
      },
    ],
  },
  {
    id: 'kb-4',
    category: 'Zakat',
    keywords: ['tell me more about zakat rules', 'zakat rules', 'zakat conditions'],
    responses: [
      {
        text: 'Zakat has specific conditions: 1) You must own wealth above the Nisab threshold, 2) You must have owned it for a full lunar year, 3) The wealth must be in excess of your basic needs, 4) It must be wealth that has potential for growth. Assets subject to Zakat include cash, gold, silver, business inventory, and certain investments.',
      },
    ],
  },
  {
    id: 'kb-5',
    category: 'General',
    keywords: ['no, thank you', 'no thanks', 'not now'],
    responses: [
      {
        text: 'Barakallahu feeki. If you change your mind, just let me know. Is there anything else about Islamic finance I can help you with today?',
      },
    ],
  },
  {
    id: 'kb-6',
    category: 'Investments',
    keywords: ['halal', 'investments', 'investing', 'what are halal investments?', 'shariah compliant', 'islamic investing'],
    responses: [
      {
        text: 'Halal investments comply with Shariah principles and avoid prohibited activities like Riba (interest), gambling (Maysir), excessive uncertainty (Gharar), and businesses dealing in alcohol, pork, tobacco, or adult entertainment. Examples include Shariah-compliant stocks, Sukuk (Islamic bonds), real estate, and precious metals.',
        source: { title: 'Islamic Investment Guide', url: '#' },
      },
      {
        text: 'Would you like to learn about specific halal investment options?',
        actions: [
          { id: 'sukuk-info', text: 'Tell me about Sukuk' },
          { id: 'halal-stocks', text: 'Halal stock screening' },
          { id: 'real-estate', text: 'Islamic real estate investing' },
        ],
      },
    ],
  },
  {
    id: 'kb-7',
    category: 'Finance Concepts',
    keywords: ['riba', 'interest', 'explain riba', 'what is riba', 'usury', 'forbidden interest'],
    responses: [
      {
        text: "Riba literally means 'increase' or 'addition' and refers to any predetermined excess or increase on a loan or exchange. Islam prohibits Riba because it can lead to exploitation, economic inequality, and social injustice. There are two types: Riba Al-Nasiah (interest on loans) and Riba Al-Fadl (unfair exchange of goods of the same type).",
      },
    ],
  },
  {
    id: 'kb-8',
    category: 'Banking',
    keywords: ['islamic banking', 'islamic bank', 'shariah banking', 'halal banking', 'what is islamic banking'],
    responses: [
      {
        text: 'Islamic banking operates according to Shariah principles, avoiding interest (Riba) and instead using profit-and-loss sharing, asset-backed financing, and trade-based transactions. Common products include Murabaha (cost-plus financing), Ijara (leasing), and Mudaraba (profit-sharing partnerships).',
        actions: [
          { id: 'murabaha-info', text: 'Explain Murabaha' },
          { id: 'ijara-info', text: 'What is Ijara?' },
          { id: 'mudaraba-info', text: 'Tell me about Mudaraba' },
        ],
      },
    ],
  },
  {
    id: 'kb-9',
    category: 'Finance Concepts',
    keywords: ['sukuk', 'tell me about sukuk', 'islamic bonds'],
    responses: [
      {
        text: 'Sukuk are Islamic financial certificates that represent ownership in underlying assets, not debt. Unlike conventional bonds that pay interest, Sukuk holders receive returns from the performance of the underlying assets, making them Shariah-compliant investment instruments.',
      },
    ],
  },
  {
    id: 'kb-10',
    category: 'Finance Concepts',
    keywords: ['murabaha', 'explain murabaha', 'cost plus'],
    responses: [
      {
        text: 'Murabaha is a cost-plus-profit financing structure where the bank purchases an asset and sells it to the customer at a marked-up price, payable in installments. The profit margin is agreed upon in advance, making it transparent and Shariah-compliant.',
      },
    ],
  },
  {
    id: 'kb-11',
    category: 'Finance Concepts',
    keywords: ['ijara', 'what is ijara', 'islamic leasing'],
    responses: [
      {
        text: 'Ijara is an Islamic leasing arrangement where the bank purchases an asset and leases it to the customer for an agreed rental amount. At the end of the lease term, ownership may transfer to the lessee (Ijara wa Iqtina) or the asset returns to the lessor.',
      },
    ],
  },
  {
    id: 'kb-12',
    category: 'Finance Concepts',
    keywords: ['mudaraba', 'tell me about mudaraba', 'profit sharing'],
    responses: [
      {
        text: 'Mudaraba is a profit-sharing partnership where one party (Rabb al-Mal) provides capital and the other (Mudarib) provides expertise and management. Profits are shared according to pre-agreed ratios, while losses are borne by the capital provider unless caused by the manager\'s negligence.',
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
      text: "JazakAllahu khair for your question. While I'm continuously learning about Islamic finance, I may not have specific information about this topic yet. For detailed religious rulings, I recommend consulting with a qualified Islamic scholar. However, I can help you with Zakat calculations, basic Islamic banking concepts, or halal investment principles.",
      actions: [
        { id: 'zakat-help', text: 'Help with Zakat calculation' },
        { id: 'halal-investments', text: 'Learn about halal investments' },
        { id: 'islamic-banking', text: 'Islamic banking basics' },
      ],
    },
  ],
};
