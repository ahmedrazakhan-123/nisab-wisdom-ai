
import HeroSection from '@/components/HeroSection';
import UnifiedTrustSection from '@/components/UnifiedTrustSection';
import FeaturesSection from '@/components/FeaturesSection';
import TestimonialsSection from '@/components/TestimonialsSection';
import HowItWorksSection from '@/components/HowItWorksSection';
import Footer from '@/components/Footer';
import FaqSection from '@/components/FaqSection';
import InteractiveChatPreview from '@/components/InteractiveChatPreview';
import ExitIntentModal from '@/components/ExitIntentModal';
import HomepageZakatWidget from '@/components/HomepageZakatWidget';
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Header from '@/components/Header';
import { useExitIntent } from '@/hooks/useExitIntent';

const Index = () => {
  const location = useLocation();
  const [showExitIntent, setShowExitIntent] = useState(false);
  
  const { isTriggered, markAsShown } = useExitIntent({
    enabled: true,
    onExitIntent: () => setShowExitIntent(true)
  });

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
        <HomepageZakatWidget />
        <UnifiedTrustSection />
        <FeaturesSection />
        <TestimonialsSection />
        <HowItWorksSection />
        <FaqSection />
      </main>
      <Footer />
      <InteractiveChatPreview />
      <ExitIntentModal 
        isVisible={showExitIntent} 
        onClose={() => {
          setShowExitIntent(false);
          markAsShown();
        }} 
      />
    </div>
  );
};

export default Index;
