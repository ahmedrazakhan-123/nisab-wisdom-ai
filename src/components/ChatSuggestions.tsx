
import React from 'react';
import { Button } from './ui/button';
import { ChatSuggestion } from '@/lib/chat-mock';
import { Sparkles, Calculator, Landmark, Scale } from 'lucide-react';

interface ChatSuggestionsProps {
  suggestions: ChatSuggestion[];
  onSuggestionClick: (suggestionText: string) => void;
  isSending: boolean;
}

const iconMap: { [key: string]: React.ElementType } = {
  Calculator,
  Landmark,
  Scale,
  Default: Sparkles,
};

const ChatSuggestions: React.FC<ChatSuggestionsProps> = ({ suggestions, onSuggestionClick, isSending }) => {
  if (suggestions.length === 0) return null;

  return (
    <div className="p-4 flex flex-wrap justify-center gap-2">
      {suggestions.map((suggestion, index) => {
        const Icon = iconMap[suggestion.icon] || iconMap.Default;
        return (
          <Button
            key={suggestion.id}
            variant="outline"
            size="sm"
            className="border-brand-gold/50 hover:bg-brand-gold/10 text-brand-teal dark:text-brand-teal-light dark:border-brand-gold/70 dark:hover:bg-brand-gold/20 animate-fade-in-up"
            style={{ animationDelay: `${index * 100}ms`, opacity: 0 }}
            onClick={() => onSuggestionClick(suggestion.text)}
            disabled={isSending}
          >
            <Icon className="w-4 h-4 mr-2 shrink-0" />
            {suggestion.text}
          </Button>
        );
      })}
    </div>
  );
};

export default ChatSuggestions;
