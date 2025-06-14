
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
    <Card 
      className="bg-white/70 backdrop-blur-sm shadow-lg rounded-xl p-6 text-center h-full hover:shadow-xl transition-shadow duration-300 animate-fade-in-up"
      style={{ animationDelay }}
    >
      <CardHeader className="pb-4 items-center">
        <div className="relative mb-4">
          <div className="mx-auto bg-brand-gold/10 text-brand-gold p-4 rounded-full w-16 h-16 flex items-center justify-center">
            <Icon size={32} strokeWidth={1.5} />
          </div>
          <div className="absolute -top-2 -right-2 bg-brand-teal text-white rounded-full w-7 h-7 flex items-center justify-center text-sm font-bold shadow-md">
            {stepNumber}
          </div>
        </div>
        <CardTitle className="text-lg font-semibold text-gray-800" style={{ fontFamily: "'Lora', serif" }}>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600 text-sm">{description}</p>
      </CardContent>
    </Card>
  );
};

export default HowItWorksCard;
