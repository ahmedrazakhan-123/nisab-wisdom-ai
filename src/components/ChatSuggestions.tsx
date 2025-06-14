
import React from 'react';
import { Button } from './ui/button';
import { ChatSuggestion } from '@/lib/chat-mock';
import { Sparkles } from 'lucide-react';

interface ChatSuggestionsProps {
  suggestions: ChatSuggestion[];
  onSuggestionClick: (suggestionText: string) => void;
  isSending: boolean;
}

const ChatSuggestions: React.FC<ChatSuggestionsProps> = ({ suggestions, onSuggestionClick, isSending }) => {
  if (suggestions.length === 0) return null;

  return (
    <div className="p-4 flex flex-wrap justify-center gap-2 animate-fade-in">
        {suggestions.map((suggestion) => (
            <Button
                key={suggestion.id}
                variant="outline"
                size="sm"
                className="border-brand-gold/50 hover:bg-brand-gold/10 text-brand-teal dark:text-brand-teal-light dark:border-brand-gold/70 dark:hover:bg-brand-gold/20"
                onClick={() => onSuggestionClick(suggestion.text)}
                disabled={isSending}
            >
                <Sparkles className="w-4 h-4 mr-2" />
                {suggestion.text}
            </Button>
        ))}
    </div>
  );
};

export default ChatSuggestions;
