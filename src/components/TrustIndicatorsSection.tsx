import React from 'react';
import { ShieldCheck, BookOpenText, Users } from 'lucide-react';
import TrustBadge from './TrustBadge'; // Re-using TrustBadge for consistency

const TrustIndicatorsSection: React.FC = () => {
  const indicators = [
    {
      icon: BookOpenText,
      text: 'Knowledge based on authentic Islamic scholarship.',
      delay: '0s',
    },
    {
      icon: ShieldCheck,
      text: 'Continuously verified for accuracy and compliance.',
      delay: '0.1s',
    },
    {
      icon: Users,
      text: 'Guided by a panel of Islamic finance experts.',
      delay: '0.2s',
    },
  ];

  return (
    <section id="trust-indicators-section" className="py-16 md:py-24 bg-brand-cream">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-brand-teal mb-3" style={{ fontFamily: "'Lora', serif" }}>
            Built on Trust & Accuracy
          </h2>
          <p className="text-muted-foreground md:text-lg max-w-2xl mx-auto">
            Nisab.AI is committed to providing reliable and Shariah-compliant financial guidance.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {indicators.map((indicator, index) => (
            <TrustBadge
              key={index}
              icon={indicator.icon}
              text={indicator.text}
              animationDelay={indicator.delay}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustIndicatorsSection;
