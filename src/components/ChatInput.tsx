
import React, { useState } from 'react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { ArrowUp, Paperclip } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isSending: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isSending }) => {
  const [inputValue, setInputValue] = useState('');

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
    // Auto-resize logic
    e.target.style.height = 'auto';
    e.target.style.height = `${e.target.scrollHeight}px`;
  };

  const handleSendMessage = () => {
    if (inputValue.trim() && !isSending) {
      onSendMessage(inputValue.trim());
      setInputValue('');
      // Manually reset height after sending
      const textarea = document.querySelector('textarea');
      if (textarea) textarea.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="pt-2">
      <div className="relative">
        <Textarea
          placeholder="Send a message..."
          value={inputValue}
          onChange={handleTextareaChange}
          onKeyDown={handleKeyDown}
          disabled={isSending}
          className="pl-12 pr-14 text-base resize-none min-h-[52px] max-h-48 rounded-xl bg-muted border-0 focus-visible:ring-1 focus-visible:ring-brand-teal"
          rows={1}
        />
        <div className="absolute bottom-2.5 left-3">
            <Button variant="ghost" size="icon" className="text-muted-foreground h-8 w-8" disabled>
                <Paperclip className="h-5 w-5" />
                <span className="sr-only">Attach file</span>
            </Button>
        </div>
        <div className="absolute bottom-2.5 right-3">
            <Button
              type="button"
              size="icon"
              className={cn(
                "h-8 w-8 shrink-0 rounded-full",
                (inputValue.trim() && !isSending)
                  ? "bg-brand-teal text-white hover:bg-brand-teal-dark"
                  : "bg-black/10 dark:bg-white/10 text-foreground/50 cursor-not-allowed"
              )}
              disabled={isSending || !inputValue.trim()}
              onClick={handleSendMessage}
            >
              <ArrowUp className="h-5 w-5" />
              <span className="sr-only">Send Message</span>
            </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatInput;
