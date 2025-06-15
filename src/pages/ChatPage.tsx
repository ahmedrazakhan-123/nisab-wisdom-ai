
import React from 'react';
import ChatInterface from '@/components/ChatInterface';
import AppSidebar from '@/components/AppSidebar';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';

const ChatPage: React.FC = () => {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-sidebar">
        <AppSidebar />
        <SidebarInset>
          <ChatInterface />
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default ChatPage;

