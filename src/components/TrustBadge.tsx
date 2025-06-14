
import React from 'react';
import { LucideIcon } from 'lucide-react';

interface TrustBadgeProps {
  icon: LucideIcon;
  text: string;
  animationDelay?: string;
}

const TrustBadge: React.FC<TrustBadgeProps> = ({ icon: Icon, text, animationDelay = '0s' }) => {
  return (
    <div className="flex items-center space-x-3 p-4 bg-white/80 backdrop-blur-sm rounded-lg shadow-md animate-fade-in-up" style={{ animationDelay }}>
      <Icon className="text-brand-gold h-7 w-7" strokeWidth={1.5} />
      <span className="text-sm font-medium text-gray-700">{text}</span>
    </div>
  );
};

export default TrustBadge;

