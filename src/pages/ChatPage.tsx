import React, { useState, useEffect, useCallback } from 'react';
import ChatInterface from '@/components/ChatInterface';
import AppSidebar from '@/components/AppSidebar';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useAppearance, FONT_CLASSES, ACCENT_COLORS, TEXT_SIZE_CLASSES } from '@/hooks/useAppearance';
import { cn } from '@/lib/utils';

const ChatPage: React.FC = () => {
  const { chatId } = useParams<{ chatId?: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  const [chatHistory, setChatHistory] = useState<{ id: string; title: string }[]>([]);
  const { font, color, textSize } = useAppearance();

  useEffect(() => {
    try {
      const storedHistory = localStorage.getItem('chatHistory');
      if (storedHistory) {
        setChatHistory(JSON.parse(storedHistory));
      }
    } catch (error) {
      console.error("Failed to parse chat history from localStorage", error);
      setChatHistory([]);
    }
  }, []);

  const handleNewChat = useCallback(() => {
    const newChatId = `chat-${Date.now()}`;
    setChatHistory(prevHistory => {
        const newChat = {
          id: newChatId,
          title: `New Chat`, // Changed to a generic title
        };
        const updatedHistory = [newChat, ...prevHistory];
        localStorage.setItem('chatHistory', JSON.stringify(updatedHistory));
        return updatedHistory;
    });
    navigate(`/chat/${newChatId}`);
  }, [navigate]);

  const handleUpdateChatTitle = useCallback((chatIdToUpdate: string, newTitle: string) => {
    setChatHistory(prevHistory => {
        const updatedHistory = prevHistory.map(chat => 
            chat.id === chatIdToUpdate ? { ...chat, title: newTitle } : chat
        );
        if (JSON.stringify(prevHistory) !== JSON.stringify(updatedHistory)) {
            localStorage.setItem('chatHistory', JSON.stringify(updatedHistory));
        }
        return updatedHistory;
    });
  }, []);
  
  const handleRemoveChat = useCallback((chatIdToRemove: string) => {
    setChatHistory(prevHistory => {
        const updatedHistory = prevHistory.filter(chat => chat.id !== chatIdToRemove);
        localStorage.setItem('chatHistory', JSON.stringify(updatedHistory));

        if (chatId === chatIdToRemove) {
            if (updatedHistory.length > 0) {
                navigate(`/chat/${updatedHistory[0].id}`);
            } else {
                handleNewChat();
            }
        }
        return updatedHistory;
    });
  }, [chatId, navigate, handleNewChat]);

  useEffect(() => {
    if (!chatId && location.pathname.startsWith('/chat')) {
      handleNewChat();
    }
  }, [chatId, location.pathname, handleNewChat]);

  return (
    <SidebarProvider>
      <div 
        className={cn(
          "flex min-h-screen w-full bg-sidebar",
          FONT_CLASSES[font],
          TEXT_SIZE_CLASSES[textSize]
        )}
        style={ACCENT_COLORS[color] as React.CSSProperties}
      >
        <AppSidebar
          activeChatId={chatId}
          chatHistory={chatHistory}
          onNewChat={handleNewChat}
          onRemoveChat={handleRemoveChat}
        />
        <SidebarInset>
          <ChatInterface 
            chatId={chatId} 
            onNewChat={handleNewChat} 
            onUpdateChatTitle={(newTitle) => chatId && handleUpdateChatTitle(chatId, newTitle)}
          />
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default ChatPage;
