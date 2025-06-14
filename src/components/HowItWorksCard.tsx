
import React from 'react';
import { LucideIcon } from 'lucide-react';

interface HowItWorksCardProps {
  icon: LucideIcon;
  stepNumber: number;
  title: string;
  description: string;
  animationDelay?: string;
}

const HowItWorksCard: React.FC<HowItWorksCardProps> = ({ icon: Icon, stepNumber, title, description, animationDelay = '0s' }) => {
  return (
    <div 
      className="flex flex-col items-center text-center p-6 rounded-xl h-full transition-all duration-300 ease-in-out hover:bg-brand-gold/5 animate-fade-in-up"
      style={{ animationDelay }}
    >
      <div className="mb-3">
        <span className="text-3xl font-bold text-brand-gold">
          {String(stepNumber).padStart(2, '0')}
        </span>
      </div>
      <Icon className="text-brand-teal mb-3 w-8 h-8" strokeWidth={1.5} />
      <h3 className="text-lg font-semibold text-brand-teal mb-1" style={{ fontFamily: "'Lora', serif" }}>
        {title}
      </h3>
      <p className="text-sm text-gray-600">
        {description}
      </p>
    </div>
  );
};

export default HowItWorksCard;
