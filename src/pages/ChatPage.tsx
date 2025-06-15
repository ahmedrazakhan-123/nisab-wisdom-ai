
import React from 'react';
import ChatInterface from '@/components/ChatInterface';
import AppSidebar from '@/components/AppSidebar';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { useParams } from 'react-router-dom';

const ChatPage: React.FC = () => {
  const { chatId } = useParams<{ chatId?: string }>();

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-sidebar">
        <AppSidebar activeChatId={chatId} />
        <SidebarInset>
          <ChatInterface chatId={chatId} />
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default ChatPage;
