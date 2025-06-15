
import React from 'react';
import { Button } from './ui/button';
import { ChatSuggestion } from '@/lib/chat-types';

interface ChatSuggestionsProps {
  suggestions: ChatSuggestion[];
  onSuggestionClick: (suggestionText: string) => void;
  isSending: boolean;
}

const ChatSuggestions: React.FC<ChatSuggestionsProps> = ({ suggestions, onSuggestionClick, isSending }) => {
  if (suggestions.length === 0) return null;

  return (
    <div className="pt-6 flex flex-row flex-wrap justify-center gap-2">
      {suggestions.map((suggestion) => (
        <Button
          key={suggestion.id}
          variant="outline"
          size="sm"
          className="rounded-full border-border/80 hover:bg-muted text-foreground/90 hover:text-foreground h-auto py-1.5 px-4 text-sm font-normal"
          onClick={() => onSuggestionClick(suggestion.text)}
          disabled={isSending}
        >
          <span className="whitespace-nowrap leading-tight">{suggestion.text}</span>
        </Button>
      ))}
    </div>
  );
};

export default ChatSuggestions;
