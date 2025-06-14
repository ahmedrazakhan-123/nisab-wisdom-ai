
import React from 'react';
import { cn } from '@/lib/utils';
import { Bot, User, BookOpen, Copy } from 'lucide-react';
import { ChatMessage as ChatMessageType } from '@/lib/chat-mock';
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from './ui/button';
import { useToast } from './ui/use-toast';

interface ChatMessageProps {
  message: ChatMessageType;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isBot = message.sender === 'bot';
  const { toast } = useToast();

  const handleCopy = () => {
    navigator.clipboard.writeText(message.text);
    toast({
      description: "Message copied to clipboard!",
      duration: 2000,
    });
  };

  return (
    <div className={cn('group flex items-start gap-3 w-full animate-fade-in', isBot ? 'justify-start' : 'justify-end')}>
      {isBot && (
        <Avatar className="h-8 w-8 bg-brand-teal text-white shrink-0">
          <AvatarFallback><Bot size={18} /></AvatarFallback>
        </Avatar>
      )}
      
      <div className={cn(
        "flex flex-col max-w-md lg:max-w-xl",
        isBot ? "items-start" : "items-end"
      )}>
        <div className={cn('relative rounded-xl px-4 py-3 text-sm', {
          'bg-card text-card-foreground border': !isBot,
          'bg-brand-teal text-white': isBot,
        })}>
          <p className="whitespace-pre-wrap">{message.text}</p>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleCopy}
            className={cn(
              "absolute -top-2 h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity",
              isBot ? "-right-2 text-brand-teal-light" : "-left-2 text-muted-foreground"
            )}
          >
            <Copy className="h-4 w-4" />
            <span className="sr-only">Copy message</span>
          </Button>
        </div>
        
        {isBot && message.source && (
          <a 
            href={message.source.url} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="mt-2 w-full max-w-xs rounded-lg border bg-card/80 backdrop-blur-sm p-2 text-xs text-muted-foreground hover:bg-muted/50 transition-colors flex items-center gap-2"
          >
            <BookOpen size={16} className="text-brand-teal shrink-0" />
            <div className="flex-grow overflow-hidden">
              <span className="font-semibold block text-card-foreground">Source</span>
              <span className="block truncate">{message.source.title}</span>
            </div>
          </a>
        )}

        <div className="text-xs mt-1.5 text-muted-foreground/80">
          {message.timestamp}
        </div>
      </div>

      {!isBot && (
        <Avatar className="h-8 w-8 bg-brand-gold text-white shrink-0">
          <AvatarFallback><User size={18} /></AvatarFallback>
        </Avatar>
      )}
    </div>
  );
};

export default ChatMessage;
