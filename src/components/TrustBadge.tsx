
import React from 'react';
import { LucideIcon } from 'lucide-react';

interface TrustBadgeProps {
  icon: LucideIcon;
  text: string;
  animationDelay?: string;
}

const TrustBadge: React.FC<TrustBadgeProps> = ({ icon: Icon, text, animationDelay = '0s' }) => {
  return (
    <div 
      className="flex items-center space-x-3 p-3 rounded-lg transition-all duration-300 ease-in-out hover:bg-brand-gold/10 animate-fade-in-up"
      style={{ animationDelay }}
    >
      <Icon className="text-brand-gold h-6 w-6" strokeWidth={1.5} />
      <span className="text-sm font-medium text-gray-700">{text}</span>
    </div>
  );
};

export default TrustBadge;
