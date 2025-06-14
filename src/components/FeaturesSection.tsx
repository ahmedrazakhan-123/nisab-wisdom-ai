
import React from 'react';
import FeatureCard from './FeatureCard';
import { TrendingUp, Calculator, ShieldCheck, Scale } from 'lucide-react';

const features = [
  {
    icon: TrendingUp,
    title: "Halal Investment Advice",
    description: "Navigate the complexities of Shariah-compliant investments with AI-powered insights and personalized recommendations.",
  },
  {
    icon: Calculator,
    title: "Zakat Calculator",
    description: "Easily calculate your Zakat obligations with our intuitive tool, ensuring accuracy and peace of mind.",
  },
  {
    icon: ShieldCheck,
    title: "Crypto Fatwa Guide",
    description: "Get clarity on the Islamic permissibility of various cryptocurrencies and blockchain projects.",
  },
  {
    icon: Scale,
    title: "Debt & Riba Analysis",
    description: "Understand and manage debt according to Islamic principles, avoiding Riba (interest) effectively.",
  },
];

const FeaturesSection: React.FC = () => {
  return (
    <section className="bg-slate-50 dark:bg-card section-padding"> {/* Ensured dark mode bg consistency */}
      <div className="container mx-auto">
        <div className="text-center mb-16 md:mb-20"> {/* Increased mb-12 to mb-16 md:mb-20 */}
          <h2 className="text-3xl md:text-4xl font-bold text-brand-teal mb-6" style={{ fontFamily: "'Lora', serif" }}> {/* Increased mb-4 to mb-6 */}
            Your Guide to Islamic Finance
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto"> {/* Increased max-w-2xl to max-w-3xl */}
            Nisab offers a suite of tools and knowledge to help you manage your finances in accordance with Islamic values.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <FeatureCard 
              key={feature.title} 
              icon={feature.icon} 
              title={feature.title} 
              description={feature.description}
              animationDelay={`${index * 0.15}s`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;

