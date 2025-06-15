
import React from 'react';
import { Button } from './ui/button';
import { SidebarTrigger } from './ui/sidebar';
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const ChatHeader: React.FC = () => {
    const navigate = useNavigate();

    const handleNewChat = () => {
        navigate('/chat');
    };

    return (
        <header className="sticky top-0 z-10 flex items-center justify-between h-16 px-4 border-b bg-background">
            <div className="flex items-center gap-2">
                <SidebarTrigger />
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="flex items-center gap-2">
                            Chat model
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start">
                        <DropdownMenuItem>GPT-4</DropdownMenuItem>
                        <DropdownMenuItem>NisabAI-v1</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            <Button variant="outline" onClick={handleNewChat} className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                New Chat
            </Button>
        </header>
    );
};

export default ChatHeader;
