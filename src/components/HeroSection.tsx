import React from 'react';
import { Button } from '@/components/ui/button';
import { MessageSquareText, PlayCircle } from 'lucide-react';

const HeroSection: React.FC = () => {
  return (
    <section className="bg-brand-cream text-brand-cream-foreground section-padding relative overflow-hidden">
      {/* Background Image and Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src="/placeholder_images/photo-1487958449943-2429e8be8625.jpg" 
          alt="Modern financial district cityscape" 
          className="w-full h-full object-cover" 
        />
        <div className="absolute inset-0 bg-gradient-to-b from-brand-cream/50 via-brand-cream/70 to-brand-cream/90 dark:from-background/50 dark:via-background/70 dark:to-background/90"></div> {/* Gradient overlay for smoother transition */}
      </div>
      
      {/* Subtle geometric background (optional, adjust opacity if needed) */}
      <div className="absolute inset-0 opacity-30 subtle-geometric-background z-1"></div>
      
      {/* Subtle visual elements for AI feel */}
      <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-brand-teal/10 rounded-full animate-pulse-bg opacity-50 z-1"></div>
      <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-brand-gold/10 rounded-full animate-pulse-bg animation-delay-2000 opacity-40 z-1"></div>
      <div className="absolute top-1/3 right-1/5 w-24 h-24 bg-brand-teal/15 rounded-full animate-pulse-bg animation-delay-4000 opacity-30 z-1"></div>

      <div className="container mx-auto text-center relative z-10">
        <h1 
          className="text-4xl sm:text-5xl md:text-6xl font-bold mb-8 text-brand-teal dark:text-brand-teal-light animate-fade-in-up"
          style={{ fontFamily: "'Lora', serif" }}
        >
          Ask Any Islamic Finance Question Instantly
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground mb-12 max-w-3xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          Nisab is your trusted AI companion for Shariah-compliant financial guidance. Get clear answers and make informed decisions with confidence.
        </p>
        <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
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
        <p className="text-center mt-8 text-xs text-muted-foreground/70">
          Background image is a placeholder. Please replace with your desired visual.
        </p>
      </div>
    </section>
  );
};

export default HeroSection;
