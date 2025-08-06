
import React from 'react';
import { LucideIcon } from 'lucide-react';

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  animationDelay?: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon: Icon, title, description, animationDelay = '0s' }) => {
  return (
    <div 
      className="group trust-card magnetic-hover flex flex-col items-center text-center p-10 rounded-2xl h-full glass-effect border border-brand-teal/10 animate-trust-indicator" 
      style={{ animationDelay }}
    >
      {/* Animated Icon Container */}
      <div className="relative mb-6">
        <div className="w-16 h-16 bg-gradient-to-r from-brand-teal/20 to-brand-gold/20 rounded-2xl flex items-center justify-center group-hover:animate-glow-pulse transition-all duration-300">
          <Icon 
            className="text-brand-teal w-8 h-8 transition-all duration-300 group-hover:scale-110 group-hover:text-brand-teal-light" 
            strokeWidth={1.5} 
          />
        </div>
        {/* Floating Indicator */}
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-brand-gold rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>

      <h3 
        className="text-xl font-bold text-brand-teal mb-4 group-hover:text-brand-teal-light transition-colors duration-300" 
        style={{ fontFamily: "'Lora', serif" }}
      >
        {title}
      </h3>
      
      <p className="text-muted-foreground leading-relaxed group-hover:text-foreground transition-colors duration-300">
        {description}
      </p>
    </div>
  );
};

export default FeatureCard;

