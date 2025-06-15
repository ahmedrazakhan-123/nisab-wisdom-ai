
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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
import SettingsModal from './SettingsModal';

interface AppSidebarProps {
  activeChatId?: string;
  chatHistory: { id: string; title: string }[];
  onNewChat: () => void;
  onRemoveChat: (chatId: string) => void;
}

const AppSidebar: React.FC<AppSidebarProps> = ({ activeChatId, chatHistory, onNewChat, onRemoveChat }) => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  useEffect(() => {
    const savedFont = localStorage.getItem('app-font');
    if (savedFont === 'serif') {
      document.documentElement.classList.add('font-serif');
    } else {
      document.documentElement.classList.remove('font-serif');
    }
  }, []);

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
            <Button variant="default" className="w-full" onClick={onNewChat}>
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
                            onRemoveChat(chat.id);
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
         <Button variant="ghost" className="w-full justify-start gap-2" onClick={() => setIsSettingsOpen(true)}>
            <Settings />
            <span>Settings</span>
        </Button>
        <SettingsModal isOpen={isSettingsOpen} onOpenChange={setIsSettingsOpen} />
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
