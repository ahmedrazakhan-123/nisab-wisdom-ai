
import React from 'react';
import { cn } from '@/lib/utils';
import { Sparkles, BookOpen, Copy, ThumbsUp, ThumbsDown } from 'lucide-react';
import type { ChatMessage as ChatMessageType } from '@/lib/chat-types';
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from './ui/button';
import { useToast } from './ui/use-toast';
import QuickActionButtons from './QuickActionButtons';
import { Link } from 'react-router-dom';

interface ChatMessageProps {
  message: ChatMessageType;
  onActionClick: (text: string) => void;
  isSending: boolean;
}

const SourceContent: React.FC<{ title: string }> = ({ title }) => (
  <>
    <BookOpen size={16} className="text-brand-teal shrink-0" />
    <div className="flex-grow overflow-hidden">
      <span className="font-semibold block text-card-foreground">Source</span>
      <span className="block truncate">{title}</span>
    </div>
  </>
);

const ChatMessage: React.FC<ChatMessageProps> = ({ message, onActionClick, isSending }) => {
  const isBot = message.sender === 'bot';
  const { toast } = useToast();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.text);
      toast({
        description: "Message copied to clipboard!",
        duration: 2000,
      });
    } catch (error) {
      console.error('Failed to copy text:', error);
      toast({
        description: "Failed to copy message",
        duration: 2000,
        variant: "destructive",
      });
    }
  };

  const handleThumbsUp = () => {
    toast({
        description: "JazakAllahu khair for your feedback!",
        duration: 2000,
    });
  };
  
  const handleThumbsDown = () => {
    toast({
        description: "Feedback received. We'll work to improve!",
        duration: 2000,
    });
  };

  return (
    <div className={cn('group flex items-start gap-3 w-full py-1 animate-fade-in-up', isBot ? '' : 'justify-end')}>
      {isBot && (
        <Avatar className="h-8 w-8 bg-muted text-muted-foreground shrink-0">
          <AvatarFallback><Sparkles size={20} /></AvatarFallback>
        </Avatar>
      )}
      
      <div className={cn(
        "flex flex-col max-w-md lg:max-w-xl",
        isBot ? "items-start" : "items-end"
      )}>
        <div className={cn('relative group/message rounded-2xl px-4 py-3', {
          'bg-muted text-card-foreground': isBot,
          'bg-gray-900 text-white dark:bg-gray-200 dark:text-gray-900': !isBot,
        })}>
          <p className="whitespace-pre-wrap leading-relaxed tracking-wide">{message.text}</p>
        </div>
        
        {isBot && (
          <div className="flex items-center gap-1 mt-2 text-muted-foreground">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleCopy}
              className="h-7 w-7 hover:bg-muted"
            >
              <Copy className="h-4 w-4" />
              <span className="sr-only">Copy message</span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleThumbsUp}
              className="h-7 w-7 hover:bg-muted"
            >
              <ThumbsUp className="h-4 w-4" />
              <span className="sr-only">Like response</span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleThumbsDown}
              className="h-7 w-7 hover:bg-muted"
            >
              <ThumbsDown className="h-4 w-4" />
              <span className="sr-only">Dislike response</span>
            </Button>
          </div>
        )}
        
        {isBot && message.actions && <QuickActionButtons actions={message.actions} onActionClick={onActionClick} isSending={isSending} />}

        {isBot && message.source && (
          message.source.url.startsWith('/') ? (
            <Link 
              to={message.source.url}
              className="mt-2 w-full max-w-xs rounded-lg bg-muted/50 p-2 text-xs text-muted-foreground hover:bg-muted transition-colors flex items-center gap-2"
            >
              <SourceContent title={message.source.title} />
            </Link>
          ) : (
            <a 
              href={message.source.url} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="mt-2 w-full max-w-xs rounded-lg bg-muted/50 p-2 text-xs text-muted-foreground hover:bg-muted transition-colors flex items-center gap-2"
            >
              <SourceContent title={message.source.title} />
            </a>
          )
        )}

        <div className="text-xs mt-1.5 text-muted-foreground/80 px-1">
          {message.timestamp}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
