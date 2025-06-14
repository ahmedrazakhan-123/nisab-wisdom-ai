
import React, { useState } from 'react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { SendHorizonal, Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

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
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="p-4 border-t bg-card/80 backdrop-blur-sm">
      <div className="relative flex items-end gap-2">
        <Textarea
          placeholder="Ask about Zakat, Riba, Halal investments..."
          value={inputValue}
          onChange={handleTextareaChange}
          onKeyDown={handleKeyDown}
          disabled={isSending}
          className="pr-10 text-base resize-none min-h-[48px] max-h-48"
          rows={1}
        />
        <div className="absolute bottom-3 right-14">
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="flex items-center justify-center cursor-help" tabIndex={0}>
                  <Info className="h-4 w-4 text-muted-foreground/80" />
                </span>
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs text-sm">Nisab.AI can make mistakes. Consider checking important information.</p>
              </TooltipContent>
            </Tooltip>
        </div>
        <Button
          type="button"
          size="icon"
          className="h-10 w-10 shrink-0 bg-brand-teal hover:bg-brand-teal-dark"
          disabled={isSending || !inputValue.trim()}
          onClick={handleSendMessage}
        >
          <SendHorizonal className="h-5 w-5" />
          <span className="sr-only">Send Message</span>
        </Button>
      </div>
    </div>
  );
};

export default ChatInput;
