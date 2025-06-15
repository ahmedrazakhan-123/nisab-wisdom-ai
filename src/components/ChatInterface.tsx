
import React, { useState, useRef, useEffect } from 'react';
import type { ChatMessage as ChatMessageType, ChatSuggestion, BotResponse } from '@/lib/chat-types';
import { knowledgeBase, defaultResponse, initialSuggestions } from '@/lib/knowledge-base';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Compass } from 'lucide-react';
import ChatSuggestions from './ChatSuggestions';
import ChatHeader from './ChatHeader';

interface ChatInterfaceProps {
  chatId?: string;
  onNewChat: () => void;
  onUpdateChatTitle: (newTitle: string) => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ chatId, onNewChat, onUpdateChatTitle }) => {
    const [messages, setMessages] = useState<ChatMessageType[]>([]);
    const [suggestions, setSuggestions] = useState<ChatSuggestion[]>([]);
    const [isTyping, setIsTyping] = useState(false);
    const scrollAreaRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (chatId) {
            try {
                const storedMessages = localStorage.getItem(`chat-messages-${chatId}`);
                if (storedMessages) {
                    const parsedMessages: ChatMessageType[] = JSON.parse(storedMessages);
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
            setSuggestions(initialSuggestions);
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

        if (messages.length === 1) {
            const newTitle = text.length > 40 ? `${text.substring(0, 40)}...` : text;
            onUpdateChatTitle(newTitle);
        }

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

        const findResponse = (): BotResponse[] => {
            const lowerCaseText = text.toLowerCase();
            
            const exactMatchEntry = knowledgeBase.find(entry => entry.keywords.includes(lowerCaseText));
            if(exactMatchEntry) {
                return exactMatchEntry.responses;
            }

            let bestMatch: { entry: BotResponse[], score: number } | null = null;

            for (const entry of knowledgeBase) {
                let score = 0;
                entry.keywords.forEach(keyword => {
                    if (lowerCaseText.includes(keyword.toLowerCase())) {
                        score++;
                    }
                });

                if (score > (bestMatch?.score ?? 0)) {
                    bestMatch = { entry: entry.responses, score };
                }
            }

            if (bestMatch && bestMatch.score > 0) {
                return bestMatch.entry;
            }

            return defaultResponse.responses;
        };

        const botResponses = findResponse();
        
        const sendBotResponses = async () => {
            let currentMessages = updatedMessages;
            for (const res of botResponses) {
                const responseText = res.text;
                const typingDuration = Math.min(Math.max(responseText.length * 25, 800), 3000);
                await new Promise(resolve => setTimeout(resolve, typingDuration));

                const botMessage: ChatMessageType = {
                    ...res,
                    id: `bot-${Date.now()}-${Math.random()}`,
                    sender: 'bot',
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
            <ChatHeader onNewChat={onNewChat} />
            <ScrollArea className="flex-grow" ref={scrollAreaRef}>
                <div className="max-w-3xl mx-auto px-4 py-8 w-full">
                    {chatId && messages.length <= 1 && suggestions.length > 0 ? (
                        <div className="flex flex-col items-center justify-center text-center pt-16 sm:pt-20">
                            <h1 className="text-3xl lg:text-4xl font-semibold text-foreground mb-2 animate-fade-in-up">
                                Nisab<span className="text-brand-gold">.</span>AI
                            </h1>
                            <p className="text-base text-muted-foreground max-w-sm animate-fade-in-up [animation-delay:0.2s]">
                               Hello! I am Nisab.AI, your personal guide to Islamic finance. How can I assist you today?
                            </p>
                             <div className="animate-fade-in-up [animation-delay:0.4s] w-full max-w-md">
                                <ChatSuggestions suggestions={suggestions} onSuggestionClick={handleSendMessage} isSending={isTyping} />
                            </div>
                        </div>
                    ) : (
                        chatId &&
                        <div className="space-y-4">
                            {messages.map((msg) => (
                                <ChatMessage key={msg.id} message={msg} onActionClick={handleSendMessage} isSending={isTyping} />
                            ))}
                             {isTyping && (
                                <div className="flex items-start gap-3 justify-start animate-fade-in">
                                     <div className="h-8 w-8 bg-muted text-muted-foreground rounded-full flex items-center justify-center shrink-0">
                                        <Compass size={18} />
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
            <div className="max-w-3xl mx-auto w-full px-4 pt-2 pb-4 bg-background">
                 <ChatInput onSendMessage={handleSendMessage} isSending={isTyping} />
            </div>
        </div>
    );
};

export default ChatInterface;
