
import React from 'react';
import ChatHeader from '@/components/ChatHeader';
import ChatInterface from '@/components/ChatInterface';
import { cn } from '@/lib/utils';

const ChatPage: React.FC = () => {
  return (
    <div className={cn(
      "flex flex-col h-screen bg-brand-cream dark:bg-background",
      "subtle-geometric-background"
    )}>
      <ChatHeader />
      <main className="flex-grow overflow-hidden bg-transparent">
        <ChatInterface />
      </main>
    </div>
  );
};

export default ChatPage;
