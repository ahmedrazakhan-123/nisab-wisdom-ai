
import React from 'react';
import ChatInterface from './ChatInterface';

const ChatSection: React.FC = () => {
  return (
    <section id="chat-section" className="py-16 md:py-24 bg-brand-cream">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <ChatInterface />
      </div>
    </section>
  );
};

export default ChatSection;
