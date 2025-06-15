
import React, { useState, useEffect, useCallback } from 'react';
import ChatInterface from '@/components/ChatInterface';
import AppSidebar from '@/components/AppSidebar';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { useParams, useNavigate, useLocation } from 'react-router-dom';

const ChatPage: React.FC = () => {
  const { chatId } = useParams<{ chatId?: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  const [chatHistory, setChatHistory] = useState<{ id: string; title: string }[]>([]);

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
          title: `New Chat ${prevHistory.length + 1}`,
        };
        const updatedHistory = [newChat, ...prevHistory];
        localStorage.setItem('chatHistory', JSON.stringify(updatedHistory));
        return updatedHistory;
    });
    navigate(`/chat/${newChatId}`);
  }, [navigate]);
  
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
      <div className="flex min-h-screen w-full bg-sidebar">
        <AppSidebar
          activeChatId={chatId}
          chatHistory={chatHistory}
          onNewChat={handleNewChat}
          onRemoveChat={handleRemoveChat}
        />
        <SidebarInset>
          <ChatInterface chatId={chatId} onNewChat={handleNewChat} />
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default ChatPage;
