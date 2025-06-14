import React from 'react';
import { Button } from '@/components/ui/button';
import { MessageSquareText, PlayCircle } from 'lucide-react';

const HeroSection: React.FC = () => {
  return (
    <section className="bg-brand-cream text-brand-cream-foreground section-padding relative overflow-hidden">
      <div className="absolute inset-0 opacity-50 subtle-geometric-background"></div>
      
      {/* Subtle visual elements for AI feel */}
      <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-brand-teal/5 rounded-full animate-pulse-bg opacity-50"></div>
      <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-brand-gold/5 rounded-full animate-pulse-bg animation-delay-2000 opacity-40"></div>
      <div className="absolute top-1/3 right-1/5 w-24 h-24 bg-brand-teal/10 rounded-full animate-pulse-bg animation-delay-4000 opacity-30"></div>


      <div className="container mx-auto text-center relative z-10">
        <h1 
          className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 text-brand-teal animate-fade-in-up"
          style={{ fontFamily: "'Lora', serif" }}
        >
          Ask Any Islamic Finance Question Instantly
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          Nisab is your trusted AI companion for Shariah-compliant financial guidance. Get clear answers and make informed decisions with confidence.
        </p>
        <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
          <Button 
            asChild 
            size="lg" 
            className="bg-brand-teal hover:bg-brand-teal-light text-brand-teal-foreground px-8 py-3 text-lg rounded-lg shadow-lg transition-transform transform hover:scale-105"
          >
            <a href="#chat-section">
              <MessageSquareText className="mr-2 h-5 w-5" />
              Start Free Chat
            </a>
          </Button>
          <Button 
            asChild
            variant="outline" 
            size="lg" 
            className="border-brand-teal text-brand-teal hover:bg-brand-teal/10 px-8 py-3 text-lg rounded-lg shadow-lg transition-transform transform hover:scale-105"
          >
            <a href="#interactive-demo-section">
              <PlayCircle className="mr-2 h-5 w-5" />
              Watch Demo
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
