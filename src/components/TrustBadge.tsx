
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
      className="flex items-center space-x-4 p-4 rounded-lg transition-all duration-300 ease-in-out hover:bg-brand-gold/10 animate-fade-in-up" // Changed p-3 to p-4, space-x-3 to space-x-4
      style={{ animationDelay }}
    >
      <Icon className="text-brand-gold h-6 w-6 shrink-0" strokeWidth={1.5} /> {/* Added shrink-0 */}
      <span className="text-sm font-medium text-muted-foreground">{text}</span>
    </div>
  );
};

export default TrustBadge;

