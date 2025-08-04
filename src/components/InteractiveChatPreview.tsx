import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { MessageCircle, X, ArrowUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';

interface DemoMessage {
  text: string;
  sender: 'user' | 'bot';
  delay: number;
}

const demoConversation: DemoMessage[] = [
  { text: "Is investing in Tesla stock halal?", sender: 'user', delay: 1000 },
  { text: "Tesla is generally considered halal for investment. The company's primary business involves manufacturing electric vehicles and clean energy products, which align with Islamic values. However, you should be aware that Tesla has some debt financing. Based on most scholars' opinions, Tesla meets the criteria for Shariah-compliant investment.", sender: 'bot', delay: 2000 },
  { text: "What about cryptocurrency?", sender: 'user', delay: 1500 },
  { text: "Cryptocurrency rulings vary among scholars. Bitcoin is generally accepted by many contemporary scholars as it functions as a digital asset. However, avoid coins involved in gambling, interest-based lending, or prohibited activities. Would you like specific guidance on any particular cryptocurrency?", sender: 'bot', delay: 2500 }
];

export default function InteractiveChatPreview() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentMessages, setCurrentMessages] = useState<DemoMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isExpanded) return;

    let timeoutId: NodeJS.Timeout;
    let currentIndex = 0;

    const showNextMessage = () => {
      if (currentIndex < demoConversation.length) {
        const message = demoConversation[currentIndex];
        
        if (message.sender === 'bot') {
          setIsTyping(true);
          timeoutId = setTimeout(() => {
            setIsTyping(false);
            setCurrentMessages(prev => [...prev, message]);
            currentIndex++;
            timeoutId = setTimeout(showNextMessage, message.delay);
          }, 1000);
        } else {
          setCurrentMessages(prev => [...prev, message]);
          currentIndex++;
          timeoutId = setTimeout(showNextMessage, message.delay);
        }
      }
    };

    timeoutId = setTimeout(showNextMessage, 500);

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [isExpanded]);

  const handleTryFullVersion = () => {
    navigate('/chat');
  };

  const handleReset = () => {
    setCurrentMessages([]);
    setIsTyping(false);
    setIsExpanded(false);
  };

  if (!isExpanded) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsExpanded(true)}
          className="rounded-full h-14 w-14 bg-brand-teal hover:bg-brand-teal-light text-white shadow-lg hover:shadow-xl transition-all duration-300 animate-pulse"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 w-80 max-w-[calc(100vw-2rem)]">
      <Card className="bg-white dark:bg-card shadow-2xl border-0 overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b bg-brand-teal text-white">
          <div className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            <span className="font-semibold">Try Nisab AI</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleReset}
            className="h-8 w-8 text-white hover:bg-white/20"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="h-64 overflow-y-auto p-4 space-y-3">
          {currentMessages.map((message, index) => (
            <div
              key={index}
              className={cn(
                "flex",
                message.sender === 'user' ? "justify-end" : "justify-start"
              )}
            >
              <div
                className={cn(
                  "max-w-[80%] p-3 rounded-lg text-sm",
                  message.sender === 'user'
                    ? "bg-brand-teal text-white rounded-br-sm"
                    : "bg-muted text-foreground rounded-bl-sm"
                )}
              >
                {message.text}
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-muted p-3 rounded-lg rounded-bl-sm">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <div className="p-4 border-t bg-slate-50 dark:bg-muted/20">
          <Button
            onClick={handleTryFullVersion}
            className="w-full bg-brand-teal hover:bg-brand-teal-light text-white rounded-lg"
          >
            Try Full Version
            <ArrowUp className="h-4 w-4 ml-2 rotate-45" />
          </Button>
        </div>
      </Card>
    </div>
  );
}