
import HeroSection from '@/components/HeroSection';
import FeaturesSection from '@/components/FeaturesSection';
import HowItWorksSection from '@/components/HowItWorksSection';
import TrustBadgesSection from '@/components/TrustBadgesSection';
import Footer from '@/components/Footer';
import FaqSection from '@/components/FaqSection';
import TrustIndicatorsSection from '@/components/TrustIndicatorsSection';
import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Header from '@/components/Header';

const Index = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.state?.scrollTo) {
      const element = document.querySelector(location.state.scrollTo);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        // Clean up state to avoid re-scrolling on refresh
        window.history.replaceState({}, document.title);
      }
    }
  }, [location]);

  return (
    <div className="flex flex-col min-h-screen bg-brand-cream dark:bg-background transition-colors duration-300">
      <Header />
      <main className="flex-grow">
        <HeroSection />
        {/* <ChatSection /> Removed ChatSection component */}
        <FeaturesSection />
        <FaqSection />
        {/* <PricingSection /> Removed PricingSection component */}
        <HowItWorksSection />
        <TrustIndicatorsSection />
        <TrustBadgesSection /> {/* Keeping this for now, can be merged/removed later */}
      </main>
      <Footer />
    </div>
  );
};

export default Index;
