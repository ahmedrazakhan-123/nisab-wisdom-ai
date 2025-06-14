
import React from 'react';
import TrustBadge from './TrustBadge';
import { ShieldCheck, LockKeyhole, Users } from 'lucide-react'; // Users for 'Built by Scholars'

const trustBadges = [
  { icon: ShieldCheck, text: "Shariah-Compliant" },
  { icon: LockKeyhole, text: "Privacy First" },
  { icon: Users, text: "Built by Scholars" },
];

const TrustBadgesSection: React.FC = () => {
  return (
    <section className="bg-brand-cream section-padding">
      <div className="container mx-auto">
        <div className="flex flex-col sm:flex-row justify-center items-center gap-6 sm:gap-8 lg:gap-12">
          {trustBadges.map((badge, index) => (
            <TrustBadge 
              key={badge.text} 
              icon={badge.icon} 
              text={badge.text}
              animationDelay={`${index * 0.15}s`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustBadgesSection;

