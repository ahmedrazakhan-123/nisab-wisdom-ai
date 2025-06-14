
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

        // If it's the first message, clear suggestions and add the user message
        const newMessages = messages.length === 1 ? [messages[0], userMessage] : [...messages, userMessage];
        setMessages(newMessages);
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

    const hasStartedChat = messages.length > 1;

    return (
        <div className="flex flex-col h-full">
            <ScrollArea className="flex-grow" ref={scrollAreaRef}>
                <div className="max-w-3xl mx-auto px-4 py-8 w-full">
                    {!hasStartedChat ? (
                        <div className="text-center pt-10 sm:pt-16 animate-fade-in">
                            <div className="inline-block p-4 bg-brand-teal/10 dark:bg-brand-teal/20 text-brand-teal dark:text-brand-teal-light rounded-full mb-6">
                                <Bot size={40} />
                            </div>
                            <h1 className="text-3xl font-bold text-foreground mb-2" style={{ fontFamily: "'Lora', serif" }}>
                                Hello! How can I assist?
                            </h1>
                            <p className="text-muted-foreground max-w-lg mx-auto">
                               {initialMessages[0].text}
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {messages.map((msg) => (
                                <ChatMessage key={msg.id} message={msg} />
                            ))}
                             {isTyping && (
                                <div className="flex items-start gap-3 justify-start animate-fade-in">
                                     <div className="h-8 w-8 bg-muted text-muted-foreground rounded-full flex items-center justify-center shrink-0">
                                        <Bot size={18} />
                                     </div>
                                     <div className="rounded-lg px-4 py-3 text-sm bg-card flex items-center gap-2">
                                        <span className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse [animation-delay:0s]"></span>
                                        <span className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse [animation-delay:0.2s]"></span>
                                        <span className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse [animation-delay:0.4s]"></span>
                                     </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </ScrollArea>
            <div className="max-w-3xl mx-auto w-full px-4 pb-4">
                 <ChatSuggestions suggestions={hasStartedChat ? [] : suggestions} onSuggestionClick={handleSendMessage} isSending={isTyping} />
                 <ChatInput onSendMessage={handleSendMessage} isSending={isTyping} />
            </div>
        </div>
    );
};

export default ChatInterface;
