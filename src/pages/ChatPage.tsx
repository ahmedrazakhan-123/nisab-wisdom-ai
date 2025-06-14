
import React from 'react';
import ChatHeader from '@/components/ChatHeader';
import ChatInterface from '@/components/ChatInterface';

const ChatPage: React.FC = () => {
  return (
    <div className="flex flex-col h-screen bg-brand-cream dark:bg-background">
      <ChatHeader />
      <main className="flex-grow overflow-hidden">
        <ChatInterface />
      </main>
    </div>
  );
};

export default ChatPage;
