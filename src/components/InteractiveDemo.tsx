
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight, MessageSquare } from 'lucide-react';

const InteractiveDemo: React.FC = () => {
  return (
    <div className="w-full max-w-4xl mx-auto text-center">
      <div className="bg-card p-8 md:p-12 rounded-lg shadow-xl border border-brand-gold/20 dark:border-brand-gold/30">
        <MessageSquare className="w-12 h-12 mx-auto mb-4 text-brand-teal dark:text-brand-teal-light" />
        <h2 className="text-3xl font-bold text-brand-teal dark:text-brand-teal-light mb-4" style={{ fontFamily: "'Lora', serif" }}>
          Experience the Full Conversation
        </h2>
        <p className="text-muted-foreground md:text-lg mb-8 max-w-2xl mx-auto">
          Our static demo is just a glimpse. Step into our full-featured chat environment to get instant, personalized answers to your Islamic finance questions.
        </p>
        <Button asChild size="lg" className="bg-brand-gold hover:bg-brand-gold/90 text-brand-gold-foreground dark:bg-brand-gold dark:hover:bg-brand-gold/90 dark:text-brand-gold-foreground rounded-full px-8 py-3 text-lg transition-transform transform hover:scale-105">
          <Link to="/chat">
            Launch the Chatbot
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default InteractiveDemo;
