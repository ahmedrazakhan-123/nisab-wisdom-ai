import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, MessageSquareText } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
}

const ChatInterface: React.FC = () => {
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);

  const handleSendMessage = () => {
    if (inputValue.trim() === '') return;

    const newUserMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
    };
    // For now, AI just echoes. Replace with actual AI response logic later.
    const aiResponse: Message = {
      id: (Date.now() + 1).toString(),
      text: `Nisab.AI received: "${inputValue}" (This is a placeholder response)`,
      sender: 'ai',
    };

    setMessages((prevMessages) => [...prevMessages, newUserMessage, aiResponse]);
    setInputValue('');
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-card p-6 rounded-xl shadow-xl border"> {/* Changed bg-white to bg-card and border-brand-teal/20 to border (theme-aware) */}
      <div className="mb-4">
        <h3 className="text-xl font-semibold text-brand-teal mb-2 flex items-center" style={{ fontFamily: "'Lora', serif" }}>
          <MessageSquareText className="w-6 h-6 mr-2 text-brand-gold" />
          Ask Nisab.AI
        </h3>
        <p className="text-sm text-muted-foreground">
          Type your Islamic finance question below. For best results, be clear and specific.
        </p>
      </div>
      <div className="h-64 overflow-y-auto mb-4 p-4 border rounded-lg bg-background/70 space-y-3"> {/* Changed bg-gray-50 to bg-background/70 for better theme adaptation */}
        {messages.length === 0 && (
          <p className="text-center text-muted-foreground">No messages yet. Start by asking a question.</p>
        )}
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                msg.sender === 'user'
                  ? 'bg-brand-teal text-brand-teal-foreground' // This should adapt due to brand-teal-foreground theme definitions
                  : 'bg-brand-gold/20 text-brand-gold-foreground' // This should adapt due to brand-gold-foreground theme definitions
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
      </div>
      <div className="flex space-x-2">
        <Input
          type="text"
          placeholder="E.g., What is Zakat on rental income?"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          className="flex-grow focus-visible:ring-brand-teal"
        />
        <Button onClick={handleSendMessage} className="bg-brand-gold hover:bg-brand-gold/90 text-brand-gold-foreground">
          <Send className="w-4 h-4 mr-2" />
          Send
        </Button>
      </div>
    </div>
  );
};

export default ChatInterface;
