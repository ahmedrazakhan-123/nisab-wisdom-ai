import React from 'react';
import { ShieldCheck, BookOpenText, Users } from 'lucide-react';
import TrustBadge from './TrustBadge'; 

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
    <section id="trust-indicators-section" className="py-16 md:py-24 bg-brand-cream dark:bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-center mb-12 md:mb-16">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-brand-teal dark:text-brand-teal-light mb-4" style={{ fontFamily: "'Lora', serif" }}>
              Built on Trust & Accuracy
            </h2>
            <p className="text-muted-foreground md:text-lg mb-6">
              Nisab.AI is committed to providing reliable and Shariah-compliant financial guidance. Our platform is rooted in authentic scholarship and verified by experts.
            </p>
            <div className="mt-6 space-y-4">
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
          <div className="flex justify-center items-center animate-fade-in-up" style={{animationDelay: '0.3s'}}>
            <img 
              src="/placeholder_images/photo-1460574283810-2aab119d8511.jpg" 
              alt="Architectural detail symbolizing stability and trust" 
              className="rounded-lg shadow-xl w-full max-w-md h-auto object-cover max-h-[400px]" 
            />
          </div>
        </div>
         <p className="text-center text-sm text-muted-foreground">
          Please replace placeholder image with your desired visual.
        </p>
      </div>
    </section>
  );
};

export default TrustIndicatorsSection;
