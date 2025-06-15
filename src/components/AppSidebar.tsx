
import React from 'react';
import { Link } from 'react-router-dom';
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

const chatHistory = [
  { id: '1', title: 'Zakat on Crypto Investments' },
  { id: '2', title: 'Understanding Riba vs. Profit' },
  { id: '3', title: 'Halal Stock Screening' },
  { id: '4', title: 'Islamic Inheritance Laws' },
];

const AppSidebar: React.FC = () => {
  const handleNewChat = () => {
    window.location.reload();
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
        <SidebarGroup>
          <SidebarGroupLabel>Recent</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {chatHistory.map((chat) => (
                <SidebarMenuItem key={chat.id}>
                  <SidebarMenuButton asChild className="w-full justify-start text-sm">
                    <a href="#">
                      <MessageSquare />
                      <span>{chat.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
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
