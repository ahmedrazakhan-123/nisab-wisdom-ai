
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, MessageSquare, Star, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { trackEvent } from '@/lib/analytics';

const HeroSection: React.FC = () => {
  return (
    <section className="bg-gradient-to-br from-brand-cream via-brand-cream/95 to-brand-teal/5 dark:from-background dark:via-background/95 dark:to-brand-teal/5 section-padding relative overflow-hidden min-h-[90vh] flex items-center">
      {/* Subtle visual elements */}
      <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-brand-teal/5 rounded-full animate-pulse-bg opacity-60 z-1"></div>
      <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-brand-gold/5 rounded-full animate-pulse-bg animation-delay-2000 opacity-50 z-1"></div>
      <div className="absolute top-1/3 right-1/5 w-24 h-24 bg-brand-teal/8 rounded-full animate-pulse-bg animation-delay-4000 opacity-40 z-1"></div>

      <div className="container mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-left">
            {/* Trust Badge */}
            <div className="inline-flex items-center gap-2 bg-brand-teal/10 text-brand-teal px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Star className="w-4 h-4 fill-current" />
              Trusted by 10,000+ Muslims worldwide
            </div>

            <h1 
              className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 text-brand-teal dark:text-brand-teal-light animate-fade-in-up leading-tight"
              style={{ fontFamily: "'Lora', serif" }}
            >
              Get Instant <span className="text-brand-gold">Shariah-Compliant</span> Financial Guidance
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto lg:mx-0 animate-fade-in-up leading-relaxed" style={{ animationDelay: '0.2s' }}>
              Chat with our AI Islamic finance expert trained on authentic scholarship. Get clear answers on Zakat, Halal investments, and complex financial decisions in seconds.
            </p>

            {/* Key Benefits */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
              <div className="flex items-center gap-2 text-brand-teal">
                <CheckCircle className="w-5 h-5" />
                <span className="font-medium">Based on Authentic Sources</span>
              </div>
              <div className="flex items-center gap-2 text-brand-teal">
                <CheckCircle className="w-5 h-5" />
                <span className="font-medium">Instant Responses</span>
              </div>
              <div className="flex items-center gap-2 text-brand-teal">
                <CheckCircle className="w-5 h-5" />
                <span className="font-medium">100% Private</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row justify-center lg:justify-start items-center space-y-4 sm:space-y-0 sm:space-x-4 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
              <Button 
                asChild 
                size="lg" 
                className="bg-brand-teal hover:bg-brand-teal/90 text-white px-8 py-4 text-lg rounded-full shadow-lg transition-all transform hover:scale-105 hover:shadow-xl"
              >
                <Link to="/chat" onClick={() => trackEvent({ name: 'try_chatbot_cta', props: { location: 'hero' } })}>
                  <MessageSquare className="mr-2 h-5 w-5" />
                  Start Free Chat
                </Link>
              </Button>
              <Button 
                asChild
                variant="outline" 
                size="lg" 
                className="border-2 border-brand-teal text-brand-teal hover:bg-brand-teal hover:text-white px-8 py-4 text-lg rounded-full transition-all transform hover:scale-105"
              >
                <Link to="/pricing" onClick={() => trackEvent({ name: 'view_plans_cta', props: { location: 'hero' } })}>
                  <ArrowRight className="mr-2 h-5 w-5" />
                  View Plans
                </Link>
              </Button>
            </div>

            {/* Social Proof */}
            <p className="text-sm text-muted-foreground mt-6 animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
              ✨ Join thousands of Muslims making informed financial decisions
            </p>
          </div>

          {/* Right Visual */}
          <div className="relative lg:block hidden animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <div className="relative bg-white dark:bg-card rounded-2xl shadow-2xl p-6 border border-brand-teal/10">
              {/* Mock Chat Interface */}
              <div className="space-y-4">
                <div className="flex items-center gap-3 pb-3 border-b border-brand-teal/10">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="font-medium text-brand-teal">Nisab AI Assistant</span>
                </div>
                
                <div className="space-y-3">
                  <div className="bg-gray-100 dark:bg-muted rounded-lg p-3 text-sm">
                    How much Zakat do I need to pay on my savings?
                  </div>
                  <div className="bg-brand-teal text-white rounded-lg p-3 text-sm">
                    Based on the current nisab threshold, if your savings exceed $4,949 (585 grams of silver equivalent) for one lunar year, you owe 2.5% in Zakat. Would you like me to calculate the exact amount for you?
                  </div>
                  <div className="bg-gray-100 dark:bg-muted rounded-lg p-3 text-sm">
                    Yes, I have $15,000 in savings
                  </div>
                  <div className="bg-brand-teal text-white rounded-lg p-3 text-sm">
                    Your Zakat obligation is $375 (2.5% of $15,000). This should be paid to eligible recipients as outlined in Quran 9:60.
                  </div>
                </div>
              </div>
            </div>
            
            {/* Floating Elements */}
            <div className="absolute -top-4 -right-4 bg-brand-gold text-white p-3 rounded-full shadow-lg">
              <MessageSquare className="w-6 h-6" />
            </div>
            <div className="absolute -bottom-4 -left-4 bg-brand-teal text-white p-3 rounded-full shadow-lg">
              <CheckCircle className="w-6 h-6" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
