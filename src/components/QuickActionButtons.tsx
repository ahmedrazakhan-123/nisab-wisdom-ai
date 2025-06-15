
import React from 'react';
import { Button } from './ui/button';
import { ChatSuggestion } from '@/lib/chat-mock';

interface QuickActionButtonsProps {
  actions: ChatSuggestion[];
  onActionClick: (actionText: string) => void;
  isSending: boolean;
}

const QuickActionButtons: React.FC<QuickActionButtonsProps> = ({ actions, onActionClick, isSending }) => {
  if (!actions || actions.length === 0) return null;

  return (
    <div className="mt-3 flex flex-wrap items-start gap-2">
      {actions.map((action) => (
        <Button
          key={action.id}
          variant="outline"
          size="sm"
          className="rounded-full border-border/80 hover:bg-muted text-foreground/90 hover:text-foreground h-auto py-1 px-3 text-sm font-normal animate-fade-in-up"
          onClick={() => onActionClick(action.text)}
          disabled={isSending}
        >
          <span className="whitespace-normal leading-tight">{action.text}</span>
        </Button>
      ))}
    </div>
  );
};

export default QuickActionButtons;
