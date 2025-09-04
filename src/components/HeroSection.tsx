
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, MessageSquare, Star, Users, Shield, Calculator } from 'lucide-react';
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
      
      {/* Real Trust Indicators - Hidden on mobile, shown on desktop */}
      <div className="absolute top-4 sm:top-8 right-4 sm:right-8 z-20 hidden lg:flex flex-col space-y-4">
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

      {/* Mobile Trust Indicators - Shown only on mobile */}
      <div className="absolute top-4 left-4 z-20 lg:hidden">
        <div className="flex flex-wrap gap-2">
          <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-lg px-3 py-2 shadow-lg border border-brand-teal/20">
            <div className="flex items-center space-x-1 text-xs text-brand-teal">
              <Shield className="h-3 w-3" />
              <span className="font-semibold">Shariah</span>
            </div>
          </div>
          <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-lg px-3 py-2 shadow-lg border border-brand-gold/20">
            <div className="flex items-center space-x-1 text-xs text-brand-gold">
              <Star className="h-3 w-3 fill-current" />
              <span className="font-semibold">AI</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 max-w-6xl">
        {/* Premium Badge */}
        <div className="inline-flex items-center px-3 sm:px-4 py-2 rounded-full bg-brand-teal/10 border border-brand-teal/20 text-brand-teal text-xs sm:text-sm font-medium mb-6 sm:mb-8 animate-fade-in-up">
          <Star className="h-3 w-3 sm:h-4 sm:w-4 mr-2 fill-current" />
          <span className="hidden sm:inline">Trusted by Islamic Finance Professionals Worldwide</span>
          <span className="sm:hidden">Trusted by 50K+ Users</span>
        </div>

        {/* Conversion-Focused Headline */}
        <h1 
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 sm:mb-6 text-brand-teal dark:text-brand-teal-light leading-tight animate-fade-in-up"
          style={{ fontFamily: "'Lora', serif", animationDelay: '0.1s' }}
        >
          Calculate Your Zakat
          <br />
          <span className="bg-gradient-to-r from-brand-teal via-brand-gold to-brand-teal bg-clip-text text-transparent">
            In Seconds
          </span>
        </h1>

        {/* Direct Value Proposition */}
        <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-muted-foreground mb-6 sm:mb-8 max-w-4xl mx-auto leading-relaxed animate-fade-in-up px-2" style={{ animationDelay: '0.2s' }}>
          The most accurate Islamic finance calculator powered by AI. 
          <span className="text-brand-teal font-semibold"> Used by 50,000+ Muslims worldwide.</span>
        </p>

        {/* Credibility Metrics */}
        <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-6 lg:gap-8 mb-8 sm:mb-10 animate-fade-in-up px-4" style={{ animationDelay: '0.3s' }}>
          <div className="text-center">
            <div className="text-2xl sm:text-3xl font-bold text-brand-teal">50K+</div>
            <div className="text-xs sm:text-sm text-muted-foreground">Users Trust Us</div>
          </div>
          <div className="text-center">
            <div className="text-2xl sm:text-3xl font-bold text-brand-teal">99.9%</div>
            <div className="text-xs sm:text-sm text-muted-foreground">Accuracy Rate</div>
          </div>
          <div className="text-center">
            <div className="text-2xl sm:text-3xl font-bold text-brand-teal">Free</div>
            <div className="text-xs sm:text-sm text-muted-foreground">Always</div>
          </div>
        </div>

        {/* Single Conversion-Focused CTA */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-6 mb-6 sm:mb-8 animate-fade-in-up px-4" style={{ animationDelay: '0.4s' }}>
          <Button 
            asChild 
            size="lg" 
            className="cta-button magnetic-hover bg-brand-teal hover:bg-brand-teal/90 text-white px-8 sm:px-12 lg:px-16 py-4 sm:py-6 text-base sm:text-lg lg:text-xl rounded-xl sm:rounded-2xl shadow-2xl group relative overflow-hidden w-full sm:w-auto"
          >
            <Link to="/zakat-calculator" onClick={() => trackEvent({ name: 'calculate_zakat', props: { location: 'hero' } })}>
              <div className="absolute inset-0 bg-gradient-to-r from-brand-teal-light to-brand-teal opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <Calculator className="mr-2 sm:mr-3 h-5 w-5 sm:h-6 sm:w-6 relative z-10 transition-transform duration-300 group-hover:scale-110" />
              <span className="relative z-10 font-bold">Calculate Your Zakat Now</span>
            </Link>
          </Button>
          
          <Button 
            asChild
            variant="outline" 
            size="lg" 
            className="magnetic-hover border-2 border-brand-teal text-brand-teal hover:bg-brand-teal hover:text-white px-6 sm:px-8 lg:px-12 py-4 sm:py-6 text-base sm:text-lg rounded-xl sm:rounded-2xl shadow-xl bg-white/80 backdrop-blur-sm group relative overflow-hidden w-full sm:w-auto"
          >
            <Link to="/chat" onClick={() => trackEvent({ name: 'try_chatbot_cta', props: { location: 'hero' } })}>
              <div className="absolute inset-0 bg-brand-teal opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <MessageSquare className="mr-2 sm:mr-3 h-5 w-5 sm:h-6 sm:w-6 relative z-10 transition-transform duration-300 group-hover:translate-x-1" />
              <span className="relative z-10 font-semibold">Ask Our AI</span>
            </Link>
          </Button>
        </div>

        {/* Trust Line */}
        <p className="text-xs sm:text-sm text-muted-foreground animate-fade-in-up px-4" style={{ animationDelay: '0.5s' }}>
          <span className="hidden sm:inline">✓ No credit card required  ✓ Instant access  ✓ Endorsed by Islamic scholars</span>
          <span className="sm:hidden">✓ Free  ✓ Instant  ✓ Trusted</span>
        </p>
      </div>

      {/* Cinematic Floating Elements - Reduced on mobile */}
      <div className="absolute top-1/4 left-1/4 w-32 h-32 sm:w-64 sm:h-64 bg-brand-teal/8 rounded-full blur-3xl animate-glow-pulse opacity-60"></div>
      <div className="absolute bottom-1/4 right-1/4 w-40 h-40 sm:w-80 sm:h-80 bg-brand-gold/8 rounded-full blur-3xl animate-glow-pulse opacity-50" style={{ animationDelay: '2s' }}></div>
      <div className="absolute top-1/3 right-1/5 w-24 h-24 sm:w-48 sm:h-48 bg-brand-teal/10 rounded-full blur-2xl animate-glow-pulse opacity-40" style={{ animationDelay: '4s' }}></div>
    </section>
  );
};

export default HeroSection;
