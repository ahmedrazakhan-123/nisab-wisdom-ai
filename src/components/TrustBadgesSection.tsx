import React from 'react';
import { Shield, Award, Users, CheckCircle, Star, Globe } from 'lucide-react';
import trustPatterns from '@/assets/trust-patterns.jpg';

const TrustBadgesSection: React.FC = () => {
  const trustItems = [
    {
      icon: Shield,
      title: "Shariah Compliance",
      description: "Built on authentic Islamic finance principles",
      color: "text-emerald-600"
    },
    {
      icon: CheckCircle,
      title: "Verified Knowledge",
      description: "Content sourced from trusted scholarly works",
      color: "text-green-600"
    },
    {
      icon: Users,
      title: "Easy to Use",
      description: "Simple interface for complex financial questions",
      color: "text-brand-teal"
    },
    {
      icon: Star,
      title: "AI Powered",
      description: "Advanced technology for instant answers",
      color: "text-yellow-500"
    },
    {
      icon: Globe,
      title: "Always Available",
      description: "24/7 access to Islamic finance guidance",
      color: "text-blue-600"
    },
    {
      icon: Award,
      title: "Free Trial",
      description: "Try before you subscribe - no risk",
      color: "text-brand-gold"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-r from-brand-cream via-white to-brand-cream dark:from-background dark:via-gray-900 dark:to-background relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <img 
          src={trustPatterns}
          alt="Islamic geometric patterns"
          className="w-full h-full object-cover"
        />
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-brand-teal dark:text-brand-teal-light mb-4" style={{ fontFamily: "'Lora', serif" }}>
            Trusted & Certified
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Your financial decisions deserve the highest level of trust and compliance
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {trustItems.map((item, index) => (
            <div 
              key={index}
              className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 hover:shadow-2xl transition-all duration-300 transform hover:scale-105 animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="text-center">
                <div className={`inline-flex p-4 rounded-2xl bg-gray-50 dark:bg-gray-700 mb-6`}>
                  <item.icon className={`h-8 w-8 ${item.color}`} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                  {item.title}
                </h3>
                <p className="text-muted-foreground">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Value Guarantee */}
        <div className="mt-16 max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-brand-teal/10 via-brand-gold/10 to-brand-teal/10 rounded-2xl p-8 border border-brand-teal/20">
            <div className="text-center">
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 bg-brand-teal/20 rounded-full flex items-center justify-center">
                  <Shield className="h-8 w-8 text-brand-teal" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Our Commitment to You
              </h3>
              <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
                Every answer is carefully vetted for Shariah compliance. If you're not satisfied with the accuracy 
                of our guidance, we offer a full refund within 30 days.
              </p>
              <div className="flex items-center justify-center space-x-6 text-sm text-muted-foreground">
                <span>✓ 30-day money-back guarantee</span>
                <span>✓ Cancel anytime</span>
                <span>✓ No hidden fees</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustBadgesSection;