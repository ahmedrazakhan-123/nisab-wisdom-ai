
import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage as ChatMessageType, ChatSuggestion, initialSuggestions, chatResponses } from '@/lib/chat-mock';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bot } from 'lucide-react';
import { SidebarTrigger } from '@/components/ui/sidebar';
import ChatSuggestions from './ChatSuggestions';

interface ChatInterfaceProps {
  chatId?: string;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ chatId }) => {
    const [messages, setMessages] = useState<ChatMessageType[]>([]);
    const [suggestions, setSuggestions] = useState<ChatSuggestion[]>([]);
    const [isTyping, setIsTyping] = useState(false);
    const scrollAreaRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (chatId) {
            try {
                const storedMessages = localStorage.getItem(`chat-messages-${chatId}`);
                if (storedMessages) {
                    const parsedMessages = JSON.parse(storedMessages);
                    setMessages(parsedMessages);
                    if (parsedMessages.length <= 1) {
                        setSuggestions(initialSuggestions);
                    } else {
                        setSuggestions([]);
                    }
                } else {
                    const newChatInitialMessage: ChatMessageType = {
                        id: `bot-initial-${Date.now()}`,
                        text: 'Hello! I am Nisab.AI, your personal guide to Islamic finance. How can I assist you today?',
                        sender: 'bot',
                        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    };
                    const newMessages = [newChatInitialMessage];
                    setMessages(newMessages);
                    localStorage.setItem(`chat-messages-${chatId}`, JSON.stringify(newMessages));
                    setSuggestions(initialSuggestions);
                }
            } catch (error) {
                console.error("Failed to handle chat messages from localStorage", error);
            }
        } else {
            setMessages([]);
            setSuggestions([]);
        }
    }, [chatId]);

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
        if (!chatId) return;

        const userMessage: ChatMessageType = {
            id: `user-${Date.now()}`,
            text,
            sender: 'user',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };

        const updatedMessages = [...messages, userMessage];
        setMessages(updatedMessages);
        localStorage.setItem(`chat-messages-${chatId}`, JSON.stringify(updatedMessages));
        setSuggestions([]);
        setIsTyping(true);

        const botResponses = chatResponses[text] || chatResponses['default'];
        
        const sendBotResponses = async () => {
            let currentMessages = updatedMessages;
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
                currentMessages = [...currentMessages, botMessage];
                setMessages(currentMessages);
                localStorage.setItem(`chat-messages-${chatId}`, JSON.stringify(currentMessages));
            }
            setIsTyping(false);
        };
        
        sendBotResponses();
    };

    return (
        <div className="relative flex flex-col h-screen max-h-screen bg-background">
            <header className="sticky top-0 z-10 flex items-center h-16 px-4 border-b bg-background/80 backdrop-blur-sm md:hidden">
                <SidebarTrigger />
                <h1 className="text-lg font-semibold ml-4" style={{ fontFamily: "'Lora', serif" }}>
                    Nisab<span className="text-brand-gold dark:text-brand-gold">.</span>AI
                </h1>
            </header>
            <ScrollArea className="flex-grow" ref={scrollAreaRef}>
                <div className="max-w-3xl mx-auto px-4 py-8 w-full">
                    {!chatId ? (
                        <div className="text-center pt-24 sm:pt-32 animate-fade-in">
                            <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-3">
                                Hello there!
                            </h1>
                            <p className="text-lg lg:text-xl text-muted-foreground max-w-md mx-auto">
                               How can I help you today?
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-8">
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
            <div className="max-w-3xl mx-auto w-full px-4 pt-2 pb-4 bg-background border-t">
                 <ChatSuggestions suggestions={suggestions} onSuggestionClick={handleSendMessage} isSending={isTyping} />
                 <ChatInput onSendMessage={handleSendMessage} isSending={isTyping} />
            </div>
        </div>
    );
};

export default ChatInterface;
