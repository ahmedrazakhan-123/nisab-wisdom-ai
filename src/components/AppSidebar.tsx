
import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Settings, Plus, MessageSquare, Bot, Trash } from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenuAction,
} from '@/components/ui/sidebar';
import ThemeToggleButton from './ThemeToggleButton';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';

interface AppSidebarProps {
  activeChatId?: string;
}

const AppSidebar: React.FC<AppSidebarProps> = ({ activeChatId }) => {
  const [chatHistory, setChatHistory] = useState<{ id: string; title: string }[]>([]);
  const navigate = useNavigate();
  const location = useLocation();

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

        if (activeChatId === chatIdToRemove) {
            if (updatedHistory.length > 0) {
                navigate(`/chat/${updatedHistory[0].id}`);
            } else {
                handleNewChat();
            }
        }
        return updatedHistory;
    });
  }, [activeChatId, navigate, handleNewChat]);

  useEffect(() => {
    if (!activeChatId && location.pathname.startsWith('/chat')) {
      handleNewChat();
    }
  }, [activeChatId, location.pathname, handleNewChat]);

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2.5">
                <div className="p-1.5 bg-primary/20 text-primary rounded-lg">
                    <Bot size={24} />
                </div>
                <span className="text-xl font-semibold" style={{ fontFamily: "'Lora', serif" }}>
                    Nisab<span className="text-brand-gold dark:text-brand-gold">.</span>AI
                </span>
            </Link>
        </div>
      </SidebarHeader>
      <SidebarContent>
         <SidebarGroup>
          <SidebarGroupContent>
            <Button variant="default" className="w-full" onClick={handleNewChat}>
              <Plus className="mr-2" />
              New Chat
            </Button>
          </SidebarGroupContent>
        </SidebarGroup>
        {chatHistory.length > 0 && (
          <>
            <div className="px-3 my-2">
              <Separator />
            </div>
            <SidebarGroup>
              <SidebarGroupLabel>Recent</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {chatHistory.map((chat) => (
                    <SidebarMenuItem key={chat.id}>
                      <SidebarMenuButton asChild className={cn(
                        "w-full justify-start text-sm",
                        chat.id === activeChatId && "bg-accent text-accent-foreground"
                      )}>
                        <Link to={`/chat/${chat.id}`}>
                          <MessageSquare />
                          <span>{chat.title}</span>
                        </Link>
                      </SidebarMenuButton>
                      <SidebarMenuAction
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleRemoveChat(chat.id);
                        }}
                        showOnHover
                      >
                        <Trash className="h-4 w-4" />
                      </SidebarMenuAction>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </>
        )}
      </SidebarContent>
      <SidebarFooter className="flex-col items-start gap-2 !p-2">
        <ThemeToggleButton />
         <Button variant="ghost" className="w-full justify-start gap-2">
            <Settings />
            <span>Settings</span>
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
