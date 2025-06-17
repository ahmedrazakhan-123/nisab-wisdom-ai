
import React from 'react';
import FeatureCard from './FeatureCard';
import { Calculator, Shield, TrendingUp, Scale, BookOpen, Users } from 'lucide-react';

const features = [
  {
    icon: Calculator,
    title: "Smart Zakat Calculator",
    description: "Calculate Zakat on gold, silver, cash, stocks, and business assets with real-time nisab thresholds. Get precise amounts instantly.",
    metric: "99.9% Accuracy"
  },
  {
    icon: TrendingUp,
    title: "Halal Investment Screening",
    description: "Screen stocks, funds, and crypto for Shariah compliance. Get detailed analysis on business activities and debt ratios.",
    metric: "5000+ Assets Screened"
  },
  {
    icon: Shield,
    title: "Riba-Free Guidance",
    description: "Navigate complex financial products and avoid interest-based transactions. Understand Islamic alternatives to conventional banking.",
    metric: "Scholar Verified"
  },
  {
    icon: Scale,
    title: "Islamic Contract Analysis",
    description: "Understand Murabaha, Ijara, Musharaka, and other Islamic finance structures. Make informed decisions on complex transactions.",
    metric: "100+ Contract Types"
  },
  {
    icon: BookOpen,
    title: "Authentic Sources",
    description: "All guidance based on Quran, Sunnah, and consensus of qualified scholars. References provided for deeper study.",
    metric: "1000+ References"
  },
  {
    icon: Users,
    title: "Community Insights",
    description: "Learn from common questions and scenarios faced by the Muslim community. Real-world applications of Islamic finance principles.",
    metric: "10,000+ Users"
  },
];

const FeaturesSection: React.FC = () => {
  return (
    <section id="features" className="bg-slate-50 dark:bg-card/20 section-padding">
      <div className="container mx-auto">
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 bg-brand-teal/10 text-brand-teal px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Shield className="w-4 h-4" />
            100% Shariah Compliant
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-brand-teal mb-6" style={{ fontFamily: "'Lora', serif" }}>
            Everything You Need for <span className="text-brand-gold">Islamic Finance</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            From basic Zakat calculations to complex investment decisions, get expert guidance on all aspects of Islamic finance in one place.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={feature.title} className="group">
              <div className="bg-white dark:bg-card rounded-xl p-8 h-full border border-brand-teal/10 hover:border-brand-teal/30 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 bg-brand-teal/10 rounded-lg group-hover:bg-brand-teal group-hover:text-white transition-colors">
                    <feature.icon className="w-6 h-6 text-brand-teal group-hover:text-white" />
                  </div>
                  <div className="text-xs font-medium text-brand-gold bg-brand-gold/10 px-2 py-1 rounded-full">
                    {feature.metric}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-brand-teal mb-4" style={{ fontFamily: "'Lora', serif" }}>
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
        
        {/* CTA Section */}
        <div className="text-center mt-16">
          <div className="inline-flex flex-col sm:flex-row gap-4">
            <Button 
              asChild
              size="lg" 
              className="bg-brand-teal hover:bg-brand-teal/90 text-white px-8 py-3 rounded-full"
            >
              <Link to="/chat">Try All Features Free</Link>
            </Button>
            <Button 
              asChild
              variant="outline" 
              size="lg" 
              className="border-brand-teal text-brand-teal hover:bg-brand-teal hover:text-white px-8 py-3 rounded-full"
            >
              <Link to="/pricing">See Premium Plans</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
