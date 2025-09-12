
import React, { useState, useRef, useEffect, useCallback } from 'react';
import type { ChatMessage as ChatMessageType, ChatSuggestion, BotResponse } from '@/lib/chat-types';
import { chatAPI, type ChatAPIResponse } from '@/lib/chat-api';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sparkles, AlertCircle } from 'lucide-react';
import ChatSuggestions from './ChatSuggestions';
import ChatHeader from './ChatHeader';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface ChatInterfaceProps {
  chatId?: string;
  onNewChat: () => void;
  onUpdateChatTitle: (newTitle: string) => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ chatId, onNewChat, onUpdateChatTitle }) => {
  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const [suggestions, setSuggestions] = useState<ChatSuggestion[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [queryCount, setQueryCount] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const sendTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Initial suggestions for Islamic Finance
  const initialSuggestions: ChatSuggestion[] = [
    { id: '1', text: 'How do I calculate Zakat on my savings?' },
    { id: '2', text: 'What investments are halal in Islam?' },
    { id: '3', text: 'Explain Riba in simple terms' },
    { id: '4', text: 'What is Islamic banking?' }
  ];

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
                        text: 'Assalamu alaikum wa rahmatullahi wa barakatuh! I am Nisab.AI, your personal guide to Islamic finance. How may I assist you today with your Shariah-compliant financial journey?',
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

    const scrollToBottom = useCallback(() => {
        const viewport = scrollAreaRef.current?.querySelector('div[data-radix-scroll-area-viewport]');
        if (viewport) {
            setTimeout(() => {
                viewport.scrollTo({ top: viewport.scrollHeight, behavior: 'smooth' });
            }, 100);
        }
    }, []);
    
    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping, scrollToBottom]);

    // Debounced send message function
    const debouncedSendMessage = useCallback((text: string) => {
        if (sendTimeoutRef.current) {
            clearTimeout(sendTimeoutRef.current);
        }
        
        sendTimeoutRef.current = setTimeout(() => {
            handleSendMessageInternal(text);
        }, 300);
    }, []);

    const handleSendMessageInternal = useCallback(async (text: string) => {
        // Ensure we have a chatId - create one if needed
        let currentChatId = chatId;
        if (!currentChatId) {
            currentChatId = `chat-${Date.now()}`;
            // If we don't have a chatId, this is likely a new chat that needs to be created
            console.log('Creating new chat with ID:', currentChatId);
        }

        if (isSending) return;

        setIsSending(true);
        setErrorMessage(null);

        try {
            // Update chat title if this is the first user message
            if (messages.length === 1) {
                const newTitle = text.length > 40 ? `${text.substring(0, 40)}...` : text;
                onUpdateChatTitle(newTitle);
            }

            // Create user message
            const userMessage: ChatMessageType = {
                id: `user-${Date.now()}`,
                text,
                sender: 'user',
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            };

            const updatedMessages = [...messages, userMessage];
            setMessages(updatedMessages);
            localStorage.setItem(`chat-messages-${currentChatId}`, JSON.stringify(updatedMessages));
            setSuggestions([]);
            setIsTyping(true);

            try {
                // Call the AI API (currently using fallback responses)
                const response = await chatAPI.sendMessage({
                    message: text,
                    conversation_id: conversationId || currentChatId,
                    include_context: true
                });

                // Update conversation ID
                if (!conversationId) {
                    setConversationId(response.conversation_id);
                }

                // Create bot response message
                const botMessage: ChatMessageType = {
                    id: `bot-${Date.now()}`,
                    text: response.message,
                    sender: 'bot',
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                };

                // Add actions if suggestions are provided
                if (response.suggestions && response.suggestions.length > 0) {
                    botMessage.actions = response.suggestions.map((suggestion, index) => ({
                        id: `suggestion-${index}`,
                        text: suggestion
                    }));
                }

                const finalMessages = [...updatedMessages, botMessage];
                setMessages(finalMessages);
                localStorage.setItem(`chat-messages-${currentChatId}`, JSON.stringify(finalMessages));

            } catch (apiError) {
                console.error('API Error:', apiError);
                
                // Use fallback response
                const fallbackResponse = chatAPI.getFallbackResponse(text);
                
                const botMessage: ChatMessageType = {
                    id: `bot-fallback-${Date.now()}`,
                    text: fallbackResponse.message,
                    sender: 'bot',
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                };

                if (fallbackResponse.suggestions.length > 0) {
                    botMessage.actions = fallbackResponse.suggestions.map((suggestion, index) => ({
                        id: `fallback-suggestion-${index}`,
                        text: suggestion
                    }));
                }

                const finalMessages = [...updatedMessages, botMessage];
                setMessages(finalMessages);
                localStorage.setItem(`chat-messages-${currentChatId}`, JSON.stringify(finalMessages));

                // Show error message
                if (apiError instanceof Error) {
                    setErrorMessage(apiError.message);
                }
            }

        } catch (error) {
            console.error('Message handling error:', error);
            setErrorMessage('An unexpected error occurred. Please try again.');
        } finally {
            setIsTyping(false);
            setIsSending(false);
            setQueryCount(prev => prev + 1);
        }
    }, [chatId, messages, conversationId, isSending, onUpdateChatTitle]);

    const handleSendMessage = useCallback((text: string) => {
        debouncedSendMessage(text);
    }, [debouncedSendMessage]);

    // Cleanup timeout on unmount
    useEffect(() => {
        return () => {
            if (sendTimeoutRef.current) {
                clearTimeout(sendTimeoutRef.current);
            }
        };
    }, []);

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
                               Your personal guide to Islamic finance and Shariah-compliant financial decisions.
                            </p>
                             <div className="animate-fade-in-up [animation-delay:0.4s] w-full max-w-md">
                                <ChatSuggestions suggestions={suggestions} onSuggestionClick={handleSendMessage} isSending={isTyping || isSending} />
                            </div>
                        </div>
                    ) : (
                        chatId &&
                        <div className="space-y-4">
                            {messages.map((msg) => (
                                <ChatMessage key={msg.id} message={msg} onActionClick={handleSendMessage} isSending={isTyping || isSending} />
                            ))}
                             {isTyping && (
                                <div className="flex items-start gap-3 justify-start animate-fade-in">
                                     <div className="h-8 w-8 bg-muted text-muted-foreground rounded-full flex items-center justify-center shrink-0">
                                        <Sparkles size={18} />
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
                {errorMessage && (
                    <Alert className="mb-4 border-destructive/50 bg-destructive/10">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                            {errorMessage}
                        </AlertDescription>
                    </Alert>
                )}
                <ChatInput onSendMessage={handleSendMessage} isSending={isTyping || isSending} />
            </div>
        </div>
    );
};

export default ChatInterface;
