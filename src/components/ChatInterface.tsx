
import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage as ChatMessageType, ChatSuggestion, initialMessages, initialSuggestions, chatResponses } from '@/lib/chat-mock';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import ChatSuggestions from './ChatSuggestions';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bot } from 'lucide-react';

const ChatInterface: React.FC = () => {
    const [messages, setMessages] = useState<ChatMessageType[]>(initialMessages);
    const [suggestions, setSuggestions] = useState<ChatSuggestion[]>(initialSuggestions);
    const [isTyping, setIsTyping] = useState(false);
    const scrollAreaRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        const viewport = scrollAreaRef.current?.querySelector('div[data-radix-scroll-area-viewport]');
        if (viewport) {
            setTimeout(() => {
                viewport.scrollTo({ top: viewport.scrollHeight, behavior: 'smooth' });
            }, 100);
        }
    };
    
    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);


    const handleSendMessage = (text: string) => {
        const userMessage: ChatMessageType = {
            id: `user-${Date.now()}`,
            text,
            sender: 'user',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };

        setMessages(prev => [...prev, userMessage]);
        setSuggestions([]);
        setIsTyping(true);

        const botResponses = chatResponses[text] || chatResponses['default'];
        
        const sendBotResponses = async () => {
            for (const res of botResponses) {
                const responseText = res.text;
                // Calculate typing time based on message length for a more natural feel
                const typingDuration = Math.min(Math.max(responseText.length * 25, 800), 3000);
                await new Promise(resolve => setTimeout(resolve, typingDuration));

                const botMessage: ChatMessageType = {
                    ...res,
                    id: `bot-${Date.now()}-${Math.random()}`,
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                };
                setMessages(prev => [...prev, botMessage]);
            }
            setIsTyping(false);
        };
        
        sendBotResponses();
    };

    return (
        <div className="flex flex-col h-full bg-transparent">
             <ScrollArea className="flex-grow p-4 md:p-6" ref={scrollAreaRef}>
                <div className="space-y-6">
                    {messages.map((msg) => (
                        <ChatMessage key={msg.id} message={msg} />
                    ))}
                    {isTyping && (
                        <div className="flex items-start gap-3 justify-start animate-fade-in">
                             <div className="h-8 w-8 bg-brand-teal text-white rounded-full flex items-center justify-center shrink-0">
                                <Bot size={18} />
                             </div>
                             <div className="max-w-md rounded-lg px-4 py-3 text-sm shadow-md bg-card text-card-foreground rounded-tl-none border border-brand-teal/20 flex items-center gap-2">
                                <span className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse [animation-delay:0s]"></span>
                                <span className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse [animation-delay:0.2s]"></span>
                                <span className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse [animation-delay:0.4s]"></span>
                             </div>
                        </div>
                    )}
                </div>
            </ScrollArea>
            <ChatSuggestions suggestions={suggestions} onSuggestionClick={handleSendMessage} isSending={isTyping} />
            <ChatInput onSendMessage={handleSendMessage} isSending={isTyping} />
        </div>
    );
};

export default ChatInterface;
