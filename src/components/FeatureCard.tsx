
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
      className="flex flex-col items-center text-center p-6 rounded-xl h-full transition-all duration-300 ease-in-out hover:bg-brand-teal/5 animate-fade-in-up"
      style={{ animationDelay }}
    >
      <Icon className="text-brand-teal mb-4 w-10 h-10" strokeWidth={1.5} />
      <h3 className="text-lg font-semibold text-brand-teal mb-2" style={{ fontFamily: "'Lora', serif" }}>
        {title}
      </h3>
      <p className="text-sm text-gray-700">
        {description}
      </p>
    </div>
  );
};

export default FeatureCard;
