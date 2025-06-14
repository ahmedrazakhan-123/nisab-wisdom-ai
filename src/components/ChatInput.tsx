
import React, { useState } from 'react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { SendHorizonal } from 'lucide-react';

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
    <div className="p-4 border-t bg-card">
      <div className="relative flex items-end gap-2">
        <Textarea
          placeholder="Ask about Zakat, Riba, Halal investments..."
          value={inputValue}
          onChange={handleTextareaChange}
          onKeyDown={handleKeyDown}
          disabled={isSending}
          className="pr-12 text-base resize-none min-h-[48px] max-h-48"
          rows={1}
        />
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
      <p className="text-xs text-muted-foreground/70 text-center mt-2">
        Nisab.AI can make mistakes. Consider checking important information.
      </p>
    </div>
  );
};

export default ChatInput;
