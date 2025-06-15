
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Settings, Plus, MessageSquare, Bot } from 'lucide-react';
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

  const handleNewChat = () => {
    const newChatId = `chat-${Date.now()}`;
    const newChat = {
      id: newChatId,
      title: `New Chat ${chatHistory.length + 1}`,
    };
    const updatedHistory = [newChat, ...chatHistory];
    setChatHistory(updatedHistory);
    localStorage.setItem('chatHistory', JSON.stringify(updatedHistory));
    navigate(`/chat/${newChatId}`);
  };

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
