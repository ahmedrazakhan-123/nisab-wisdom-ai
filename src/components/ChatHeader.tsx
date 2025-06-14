
import React from 'react';
import { Link } from 'react-router-dom';
import { Menu, PlusSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ThemeToggleButton from './ThemeToggleButton';

const ChatHeader: React.FC = () => {
  const handleNewChat = () => {
    // A simple way to reset the chat state for this mock-up
    window.location.reload();
  };

  return (
    <header className="sticky top-0 z-10 flex items-center justify-between h-16 px-4 border-b bg-background/95 backdrop-blur-sm">
      <div className="flex items-center gap-4">
        {/* Sidebar toggle for future use */}
        <Button variant="ghost" size="icon" className="hidden md:flex text-muted-foreground">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle Sidebar</span>
        </Button>
        <Link to="/" className="text-lg font-semibold" style={{ fontFamily: "'Lora', serif" }}>
          Nisab<span className="text-brand-gold dark:text-brand-gold">.</span>AI
        </Link>
      </div>
      <div className="flex items-center gap-2">
        <ThemeToggleButton />
        <Button variant="outline" onClick={handleNewChat}>
          <PlusSquare className="h-4 w-4 mr-2" />
          New Chat
        </Button>
      </div>
    </header>
  );
};

export default ChatHeader;
