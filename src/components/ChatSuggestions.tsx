
import React from 'react';
import { Button } from './ui/button';
import { ChatSuggestion } from '@/lib/chat-mock';

interface ChatSuggestionsProps {
  suggestions: ChatSuggestion[];
  onSuggestionClick: (suggestionText: string) => void;
  isSending: boolean;
}

const ChatSuggestions: React.FC<ChatSuggestionsProps> = ({ suggestions, onSuggestionClick, isSending }) => {
  if (suggestions.length === 0) return null;

  return (
    <div className="pb-3 flex flex-col items-center gap-2.5 animate-fade-in w-full">
      {suggestions.map((suggestion) => (
        <Button
          key={suggestion.id}
          variant="outline"
          size="lg"
          className="w-full text-left justify-start rounded-xl border-border/80 hover:bg-muted text-foreground/90 hover:text-foreground h-auto py-3 px-4 text-base font-normal"
          onClick={() => onSuggestionClick(suggestion.text)}
          disabled={isSending}
        >
          <span className="whitespace-normal leading-tight">{suggestion.text}</span>
        </Button>
      ))}
    </div>
  );
};

export default ChatSuggestions;
