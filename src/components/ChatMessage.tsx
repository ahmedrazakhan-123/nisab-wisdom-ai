
import React from 'react';
import { cn } from '@/lib/utils';
import { Compass, User, BookOpen, Copy, RefreshCw } from 'lucide-react';
import { ChatMessage as ChatMessageType } from '@/lib/chat-mock';
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from './ui/button';
import { useToast } from './ui/use-toast';
import ZakatCalculator from './widgets/ZakatCalculator';
import QuickActionButtons from './QuickActionButtons';

interface ChatMessageProps {
  message: ChatMessageType;
  onActionClick: (text: string) => void;
  isSending: boolean;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, onActionClick, isSending }) => {
  const isBot = message.sender === 'bot';
  const { toast } = useToast();

  const handleCopy = () => {
    navigator.clipboard.writeText(message.text);
    toast({
      description: "Message copied to clipboard!",
      duration: 2000,
    });
  };

  const handleRegenerate = () => {
    // Placeholder for regeneration logic
    toast({
        description: "Regenerate response (not implemented).",
        duration: 2000,
    });
  }

  return (
    <div className={cn('group flex items-start gap-3 w-full py-2.5', isBot ? '' : 'justify-end')}>
      {isBot && (
        <Avatar className="h-8 w-8 bg-muted text-muted-foreground shrink-0">
          <AvatarFallback><Compass size={18} /></AvatarFallback>
        </Avatar>
      )}
      
      <div className={cn(
        "flex flex-col max-w-md lg:max-w-2xl w-full",
        isBot ? "items-start" : "items-end"
      )}>
        <div className={cn('relative group/message rounded-xl px-4 py-3 text-base shadow-sm w-full', {
          'bg-card border text-card-foreground rounded-bl-none': isBot,
          'bg-primary text-primary-foreground rounded-br-none': !isBot,
        })}>
          <p className="whitespace-pre-wrap leading-relaxed tracking-wide">{message.text}</p>
          
          <div className={cn(
            "absolute bottom-1 flex gap-0.5 opacity-0 group-hover/message:opacity-100 transition-opacity",
            isBot ? "-right-[4.5rem] text-muted-foreground" : "-left-[4.5rem] text-primary-foreground/80"
          )}>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleCopy}
              className={cn("h-7 w-7", !isBot && "hover:bg-white/10 hover:text-primary-foreground")}
            >
              <Copy className="h-4 w-4" />
              <span className="sr-only">Copy message</span>
            </Button>
            {isBot && (
                 <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleRegenerate}
                    className="h-7 w-7"
                >
                    <RefreshCw className="h-4 w-4" />
                    <span className="sr-only">Regenerate response</span>
                </Button>
            )}
          </div>
        </div>
        
        {isBot && message.widget === 'zakat-calculator' && <ZakatCalculator />}
        {isBot && message.actions && <QuickActionButtons actions={message.actions} onActionClick={onActionClick} isSending={isSending} />}

        {isBot && message.source && (
          <a 
            href={message.source.url} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="mt-2 w-full max-w-xs rounded-lg bg-muted/50 p-2 text-xs text-muted-foreground hover:bg-muted transition-colors flex items-center gap-2"
          >
            <BookOpen size={16} className="text-brand-teal shrink-0" />
            <div className="flex-grow overflow-hidden">
              <span className="font-semibold block text-card-foreground">Source</span>
              <span className="block truncate">{message.source.title}</span>
            </div>
          </a>
        )}

        <div className="text-xs mt-1.5 text-muted-foreground/80 px-1">
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
