
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

export interface BotResponse {
    text: string;
    source?: { title: string; url: string };
    widget?: 'zakat-calculator';
    actions?: ChatSuggestion[];
}

export interface KnowledgeBaseEntry {
  id: string;
  category: string;
  keywords: string[];
  responses: BotResponse[];
}
