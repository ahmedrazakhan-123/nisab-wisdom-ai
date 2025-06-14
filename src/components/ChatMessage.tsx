
import React from 'react';
import { cn } from '@/lib/utils';
import { Bot, User, BookOpen } from 'lucide-react';
import { ChatMessage as ChatMessageType } from '@/lib/chat-mock';
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface ChatMessageProps {
  message: ChatMessageType;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isBot = message.sender === 'bot';

  return (
    <div className={cn('flex items-start gap-3 animate-fade-in', isBot ? 'justify-start' : 'justify-end')}>
      {isBot && (
        <Avatar className="h-8 w-8 bg-brand-teal text-white shrink-0">
          <AvatarFallback><Bot size={18} /></AvatarFallback>
        </Avatar>
      )}
      <div className={cn('max-w-md lg:max-w-lg rounded-lg px-4 py-3 text-sm shadow-md', {
        'bg-card text-card-foreground rounded-tl-none border border-brand-teal/20': isBot,
        'bg-brand-teal text-white rounded-tr-none': !isBot,
      })}>
        <p className="whitespace-pre-wrap">{message.text}</p>
        {isBot && message.source && (
          <a href={message.source.url} target="_blank" rel="noopener noreferrer" className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground/80 hover:text-muted-foreground transition-colors">
            <BookOpen size={12} />
            <span>Source: {message.source.title}</span>
          </a>
        )}
        <div className={cn('text-xs mt-1.5', isBot ? 'text-right text-muted-foreground/70' : 'text-left text-brand-teal-light/70')}>
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
