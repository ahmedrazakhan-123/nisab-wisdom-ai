
import HeroSection from '@/components/HeroSection';
import FeaturesSection from '@/components/FeaturesSection';
import TestimonialsSection from '@/components/TestimonialsSection';
import HowItWorksSection from '@/components/HowItWorksSection';
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
        <FeaturesSection />
        <TestimonialsSection />
        <FaqSection />
        <HowItWorksSection />
        <TrustIndicatorsSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
