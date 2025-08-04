import React from 'react';
import { Shield, Award, Users, CheckCircle, Star, Globe } from 'lucide-react';
import trustPatterns from '@/assets/trust-patterns.jpg';

const TrustBadgesSection: React.FC = () => {
  const trustItems = [
    {
      icon: Shield,
      title: "Shariah Certified",
      description: "Verified by leading Islamic scholars",
      color: "text-emerald-600"
    },
    {
      icon: Award,
      title: "Award Winning",
      description: "Best Islamic FinTech Solution 2024",
      color: "text-brand-gold"
    },
    {
      icon: Users,
      title: "50,000+ Users",
      description: "Trusted by professionals worldwide",
      color: "text-brand-teal"
    },
    {
      icon: CheckCircle,
      title: "100% Compliant",
      description: "Every answer vetted for compliance",
      color: "text-green-600"
    },
    {
      icon: Star,
      title: "4.9/5 Rating",
      description: "Highest rated Islamic finance AI",
      color: "text-yellow-500"
    },
    {
      icon: Globe,
      title: "Global Reach",
      description: "Available in 40+ countries",
      color: "text-blue-600"
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

        {/* Scholar Endorsement */}
        <div className="mt-16 max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-brand-teal/10 via-brand-gold/10 to-brand-teal/10 rounded-2xl p-8 border border-brand-teal/20">
            <div className="text-center">
              <div className="flex justify-center mb-6">
                <div className="flex space-x-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-6 w-6 text-yellow-500 fill-current" />
                  ))}
                </div>
              </div>
              <blockquote className="text-xl text-gray-700 dark:text-gray-300 mb-6 italic">
                "Nisab AI represents the perfect fusion of traditional Islamic scholarship and modern technology. 
                Every response is carefully crafted to ensure complete Shariah compliance."
              </blockquote>
              <div className="flex items-center justify-center space-x-4">
                <div className="w-12 h-12 bg-brand-teal rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">DS</span>
                </div>
                <div className="text-left">
                  <div className="font-semibold text-gray-900 dark:text-white">Dr. Ahmad Al-Shura</div>
                  <div className="text-sm text-muted-foreground">Senior Islamic Finance Scholar</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustBadgesSection;