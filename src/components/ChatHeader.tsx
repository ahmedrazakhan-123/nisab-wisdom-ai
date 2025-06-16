
import React from 'react';
import { Button } from './ui/button';
import { SidebarTrigger } from './ui/sidebar';
import { Plus } from 'lucide-react';

interface ChatHeaderProps {
    onNewChat: () => void;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ onNewChat }) => {
    return (
        <header className="sticky top-0 z-10 flex items-center justify-between h-14 px-4 border-b bg-background">
            <div className="flex items-center gap-2">
                <SidebarTrigger />
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-muted text-muted-foreground text-sm">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    NisabAI Online
                </div>
            </div>
            <Button variant="outline" onClick={onNewChat} className="flex items-center gap-2 rounded-full">
                <Plus className="h-4 w-4" />
                New Chat
            </Button>
        </header>
    );
};

export default ChatHeader;
