
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
      className="flex flex-col items-center text-center p-8 rounded-xl h-full transition-all duration-300 ease-in-out hover:bg-brand-gold/5 animate-fade-in-up" // Changed p-6 to p-8
      style={{ animationDelay }}
    >
      <div className="mb-4"> {/* Changed mb-3 to mb-4 */}
        <span className="text-3xl font-bold text-brand-gold">
          {String(stepNumber).padStart(2, '0')}
        </span>
      </div>
      <Icon className="text-brand-teal mb-4 w-8 h-8" strokeWidth={1.5} /> {/* Changed mb-3 to mb-4 */}
      <h3 className="text-lg font-semibold text-brand-teal mb-2" style={{ fontFamily: "'Lora', serif" }}> {/* Changed mb-1 to mb-2 */}
        {title}
      </h3>
      <p className="text-sm text-muted-foreground leading-relaxed"> {/* Added leading-relaxed */}
        {description}
      </p>
    </div>
  );
};

export default HowItWorksCard;

