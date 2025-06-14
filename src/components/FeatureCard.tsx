
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
      className="flex flex-col items-center text-center p-8 rounded-xl h-full transition-all duration-300 ease-in-out hover:bg-brand-teal/5 animate-fade-in-up" // Changed p-6 to p-8
      style={{ animationDelay }}
    >
      <Icon className="text-brand-teal mb-5 w-10 h-10" strokeWidth={1.5} /> {/* Changed mb-4 to mb-5 */}
      <h3 className="text-lg font-semibold text-brand-teal mb-3" style={{ fontFamily: "'Lora', serif" }}> {/* Changed mb-2 to mb-3 */}
        {title}
      </h3>
      <p className="text-sm text-muted-foreground leading-relaxed"> {/* Added leading-relaxed for better readability if description is long */}
        {description}
      </p>
    </div>
  );
};

export default FeatureCard;

