
import React, { useState } from 'react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { SendHorizonal, Paperclip } from 'lucide-react';

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
          placeholder="Ask about Zakat, Riba, Halal investments..."
          value={inputValue}
          onChange={handleTextareaChange}
          onKeyDown={handleKeyDown}
          disabled={isSending}
          className="pr-24 text-base resize-none min-h-[52px] max-h-48 rounded-xl bg-muted border-0 focus-visible:ring-1 focus-visible:ring-brand-teal"
          rows={1}
        />
        <div className="absolute top-1/2 -translate-y-1/2 right-3 flex items-center gap-1">
            <Button variant="ghost" size="icon" className="text-muted-foreground" disabled>
                <Paperclip className="h-5 w-5" />
                <span className="sr-only">Attach file</span>
            </Button>
            <Button
              type="button"
              size="icon"
              className="h-9 w-9 shrink-0 bg-brand-teal hover:bg-brand-teal-dark rounded-full"
              disabled={isSending || !inputValue.trim()}
              onClick={handleSendMessage}
            >
              <SendHorizonal className="h-5 w-5" />
              <span className="sr-only">Send Message</span>
            </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatInput;
