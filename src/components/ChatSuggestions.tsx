
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
    <div className="py-4 flex flex-wrap justify-center gap-2 animate-fade-in">
      {suggestions.map((suggestion) => (
        <Button
          key={suggestion.id}
          variant="outline"
          size="sm"
          className="rounded-full border-border hover:bg-muted text-foreground/80 hover:text-foreground"
          onClick={() => onSuggestionClick(suggestion.text)}
          disabled={isSending}
        >
          {suggestion.text}
        </Button>
      ))}
    </div>
  );
};

export default ChatSuggestions;
