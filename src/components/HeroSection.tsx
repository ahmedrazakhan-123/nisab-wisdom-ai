
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, MessageSquare, Star, Users, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';
import { trackEvent } from '@/lib/analytics';
import heroImage from '@/assets/hero-islamic-finance.jpg';

const HeroSection: React.FC = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-brand-cream dark:bg-background">
      {/* Professional Background Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src={heroImage}
          alt="Islamic architecture representing trust and financial wisdom" 
          className="w-full h-full object-cover" 
        />
        <div className="absolute inset-0 bg-gradient-to-br from-brand-cream/95 via-brand-cream/85 to-brand-cream/75 dark:from-background/95 dark:via-background/85 dark:to-background/75"></div>
      </div>
      
      {/* Real Trust Indicators */}
      <div className="absolute top-8 right-8 z-20 hidden lg:flex flex-col space-y-4">
        <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-lg p-4 shadow-xl border border-brand-teal/20">
          <div className="flex items-center space-x-2 text-sm text-brand-teal">
            <Shield className="h-4 w-4" />
            <span className="font-semibold">Shariah Verified</span>
          </div>
        </div>
        <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-lg p-4 shadow-xl border border-brand-gold/20">
          <div className="flex items-center space-x-2 text-sm text-brand-gold">
            <MessageSquare className="h-4 w-4" />
            <span className="font-semibold">Free Trial</span>
          </div>
        </div>
        <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-lg p-4 shadow-xl border border-yellow-500/20">
          <div className="flex items-center space-x-2 text-sm text-yellow-600">
            <Star className="h-4 w-4 fill-current" />
            <span className="font-semibold">AI Powered</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 text-center relative z-10 max-w-6xl">
        {/* Premium Badge */}
        <div className="inline-flex items-center px-4 py-2 rounded-full bg-brand-teal/10 border border-brand-teal/20 text-brand-teal text-sm font-medium mb-8 animate-fade-in-up">
          <Star className="h-4 w-4 mr-2 fill-current" />
          Trusted by Islamic Finance Professionals Worldwide
        </div>

        {/* Powerful Headline */}
        <h1 
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-6 text-brand-teal dark:text-brand-teal-light leading-tight animate-fade-in-up"
          style={{ fontFamily: "'Lora', serif", animationDelay: '0.1s' }}
        >
          Your AI Islamic
          <br />
          <span className="bg-gradient-to-r from-brand-teal via-brand-gold to-brand-teal bg-clip-text text-transparent">
            Finance Expert
          </span>
        </h1>

        {/* Compelling Subheadline */}
        <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-4xl mx-auto leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          Get instant, Shariah-compliant financial guidance from the world's most advanced Islamic finance AI. 
          <span className="text-brand-teal font-semibold"> Trusted by scholars, used by thousands.</span>
        </p>

        {/* Real Value Propositions */}
        <div className="flex flex-wrap justify-center items-center gap-8 mb-10 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
          <div className="text-center">
            <div className="text-3xl font-bold text-brand-teal">24/7</div>
            <div className="text-sm text-muted-foreground">AI Availability</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-brand-teal">100%</div>
            <div className="text-sm text-muted-foreground">Shariah Compliant</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-brand-teal">Free</div>
            <div className="text-sm text-muted-foreground">Trial Available</div>
          </div>
        </div>

        {/* Magnetic CTAs with Apple-level Polish */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-6 mb-8 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
          <Button 
            asChild 
            size="lg" 
            className="cta-button magnetic-hover bg-brand-teal hover:bg-brand-teal/90 text-white px-12 py-5 text-lg rounded-2xl shadow-2xl group relative overflow-hidden"
          >
            <Link to="/chat" onClick={() => trackEvent({ name: 'try_chatbot_cta', props: { location: 'hero' } })}>
              <div className="absolute inset-0 bg-gradient-to-r from-brand-teal-light to-brand-teal opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <MessageSquare className="mr-3 h-6 w-6 relative z-10 transition-transform duration-300 group-hover:scale-110" />
              <span className="relative z-10 font-semibold">Start Free Chat</span>
            </Link>
          </Button>
          
          <Button 
            asChild
            variant="outline" 
            size="lg" 
            className="magnetic-hover border-2 border-brand-teal text-brand-teal hover:bg-brand-teal hover:text-white px-12 py-5 text-lg rounded-2xl shadow-xl bg-white/80 backdrop-blur-sm group relative overflow-hidden"
          >
            <Link to="/pricing" onClick={() => trackEvent({ name: 'view_plans_cta', props: { location: 'hero' } })}>
              <div className="absolute inset-0 bg-brand-teal opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <ArrowRight className="mr-3 h-6 w-6 relative z-10 transition-transform duration-300 group-hover:translate-x-1" />
              <span className="relative z-10 font-semibold">View Premium Plans</span>
            </Link>
          </Button>
        </div>

        {/* Trust Line */}
        <p className="text-sm text-muted-foreground animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
          ✓ No credit card required  ✓ Instant access  ✓ Endorsed by Islamic scholars
        </p>
      </div>

      {/* Cinematic Floating Elements */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-brand-teal/8 rounded-full blur-3xl animate-glow-pulse opacity-60"></div>
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-brand-gold/8 rounded-full blur-3xl animate-glow-pulse opacity-50" style={{ animationDelay: '2s' }}></div>
      <div className="absolute top-1/3 right-1/5 w-48 h-48 bg-brand-teal/10 rounded-full blur-2xl animate-glow-pulse opacity-40" style={{ animationDelay: '4s' }}></div>
    </section>
  );
};

export default HeroSection;
