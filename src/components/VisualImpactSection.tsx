
import React from 'react';

const VisualImpactSection: React.FC = () => {
  return (
    <section id="visual-impact" className="py-16 md:py-24 bg-brand-cream dark:bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 md:mb-16">
          <h2 
            className="text-3xl md:text-4xl font-bold text-brand-teal dark:text-brand-teal-light mb-4"
            style={{ fontFamily: "'Lora', serif" }}
          >
            Modern Finance, Rooted in Principle
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Experience clarity and confidence with Nisab.AI, where sophisticated technology meets timeless Islamic financial wisdom.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 items-center">
          <div className="rounded-lg overflow-hidden shadow-xl transform transition-all duration-300 hover:scale-105">
            <img 
              src="https://picsum.photos/seed/modernarch/800/600" 
              alt="Modern architecture representing Islamic finance" 
              className="w-full h-72 md:h-96 object-cover animate-fade-in-up"
            />
          </div>
          <div className="rounded-lg overflow-hidden shadow-xl transform transition-all duration-300 hover:scale-105" style={{ animationDelay: '0.2s' }}>
            <img 
              src="https://picsum.photos/seed/mosque/800/600" 
              alt="Serene mosque architecture symbolizing trust and tradition" 
              className="w-full h-72 md:h-96 object-cover animate-fade-in-up"
            />
          </div>
        </div>
        <p className="text-center mt-8 text-sm text-muted-foreground">
          Please replace these placeholder images with your desired visuals in 'public/placeholder_images'.
        </p>
      </div>
    </section>
  );
};

export default VisualImpactSection;
