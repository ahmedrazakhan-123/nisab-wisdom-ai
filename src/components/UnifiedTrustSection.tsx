import React from 'react';
import { Shield, Star, Users, Clock, Award, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { trackEvent } from '@/lib/analytics';

const UnifiedTrustSection: React.FC = () => {
  const trustPillars = [
    {
      icon: Shield,
      title: "100% Shariah Compliant",
      description: "Every response verified by Islamic finance scholars",
      metric: "Verified",
      color: "text-emerald-600"
    },
    {
      icon: Star,
      title: "AI-Powered Accuracy",
      description: "Advanced algorithms trained on authentic Islamic sources",
      metric: "24/7",
      color: "text-brand-gold"
    },
    {
      icon: Users,
      title: "Trusted by Thousands",
      description: "Join Islamic finance professionals worldwide",
      metric: "Growing",
      color: "text-brand-teal"
    }
  ];

  return (
    <section className="relative py-24 bg-gradient-to-br from-brand-cream via-white to-brand-cream dark:from-background dark:via-gray-900/50 dark:to-background overflow-hidden">
      {/* Cinematic Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-teal/5 rounded-full blur-3xl animate-glow-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-brand-gold/5 rounded-full blur-3xl animate-glow-pulse" style={{ animationDelay: '1.5s' }}></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Premium Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center px-6 py-3 rounded-full glass-effect border border-brand-teal/20 text-brand-teal text-sm font-semibold mb-8 animate-trust-indicator">
            <Award className="h-4 w-4 mr-2" />
            Endorsed by Islamic Finance Scholars
          </div>
          
          <h2 
            className="text-5xl md:text-6xl font-bold text-brand-teal dark:text-brand-teal-light mb-6 animate-fade-in-up"
            style={{ fontFamily: "'Lora', serif", animationDelay: '0.2s' }}
          >
            Built on Authentic
            <br />
            <span className="bg-gradient-to-r from-brand-teal via-brand-gold to-brand-teal bg-clip-text text-transparent">
              Islamic Scholarship
            </span>
          </h2>
          
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            Every answer is rooted in authentic Islamic finance principles, 
            <span className="text-brand-teal font-semibold"> continuously verified by our scholar advisory board.</span>
          </p>
        </div>

        {/* Trust Pillars - Apple-level Design */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-20">
          {trustPillars.map((pillar, index) => (
            <div 
              key={index}
              className="group trust-card glass-effect p-10 rounded-3xl animate-trust-indicator magnetic-hover"
              style={{ animationDelay: `${0.6 + index * 0.2}s` }}
            >
              <div className="text-center">
                {/* Animated Icon */}
                <div className="relative mb-8">
                  <div className="w-20 h-20 mx-auto bg-gradient-to-r from-brand-teal/20 to-brand-gold/20 rounded-2xl flex items-center justify-center group-hover:animate-glow-pulse">
                    <pillar.icon className={`h-10 w-10 ${pillar.color} transition-transform duration-300 group-hover:scale-110`} />
                  </div>
                  {/* Floating Metric */}
                  <div className="absolute -top-2 -right-2 bg-brand-teal text-white text-xs font-bold px-3 py-1 rounded-full">
                    {pillar.metric}
                  </div>
                </div>

                <h3 className="text-2xl font-bold text-foreground mb-4 group-hover:text-brand-teal transition-colors duration-300">
                  {pillar.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {pillar.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Credibility Guarantee with CTA */}
        <div className="max-w-4xl mx-auto">
          <div className="glass-effect rounded-3xl p-12 border-2 border-brand-teal/20 bg-gradient-to-r from-brand-teal/5 via-transparent to-brand-gold/5 animate-scale-in" style={{ animationDelay: '1.4s' }}>
            <div className="text-center">
              <div className="flex justify-center mb-8">
                <div className="w-20 h-20 bg-brand-teal/20 rounded-full flex items-center justify-center animate-glow-pulse">
                  <CheckCircle className="h-10 w-10 text-brand-teal" />
                </div>
              </div>
              
              <h3 className="text-3xl font-bold text-foreground mb-6">
                Your Trust, Our Guarantee
              </h3>
              
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Not satisfied with our Shariah compliance accuracy? Get a full refund within 30 days. 
                No questions asked.
              </p>

              {/* Premium CTA */}
              <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                <Button 
                  asChild 
                  size="lg" 
                  className="cta-button bg-brand-teal hover:bg-brand-teal/90 text-white px-10 py-4 text-lg rounded-2xl"
                >
                  <Link to="/chat" onClick={() => trackEvent({ name: 'try_chatbot_cta', props: { location: 'unified_trust' } })}>
                    <Star className="mr-3 h-6 w-6" />
                    Start Free Trial
                  </Link>
                </Button>
                
                <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                  <span className="flex items-center">
                    <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                    30-day guarantee
                  </span>
                  <span className="flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-blue-500" />
                    Instant access
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default UnifiedTrustSection;