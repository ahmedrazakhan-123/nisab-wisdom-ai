
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'; // Shadcn card
import { LucideIcon } from 'lucide-react';

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  animationDelay?: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon: Icon, title, description, animationDelay = '0s' }) => {
  return (
    <Card className="bg-white shadow-xl rounded-xl p-6 text-center h-full hover:shadow-2xl transition-shadow duration-300 animate-fade-in-up" style={{ animationDelay }}>
      <CardHeader className="pb-4">
        <div className="mx-auto bg-brand-teal/10 text-brand-teal p-4 rounded-full w-16 h-16 flex items-center justify-center mb-4">
          <Icon size={32} strokeWidth={1.5} />
        </div>
        <CardTitle className="text-xl font-semibold text-gray-800" style={{ fontFamily: "'Lora', serif" }}>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600 text-sm">{description}</p>
      </CardContent>
    </Card>
  );
};

export default FeatureCard;

