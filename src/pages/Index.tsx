
import HeroSection from '@/components/HeroSection';
import FeaturesSection from '@/components/FeaturesSection';
import TrustBadgesSection from '@/components/TrustBadgesSection';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="flex flex-col min-h-screen bg-brand-cream">
      <header className="sticky top-0 z-50 bg-brand-cream/80 backdrop-blur-md shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold text-brand-teal" style={{ fontFamily: "'Lora', serif" }}>
            Nisab<span className="text-brand-gold">.</span>AI
          </div>
          {/* Navigation items can be added here later */}
        </div>
      </header>
      <main className="flex-grow">
        <HeroSection />
        <FeaturesSection />
        <TrustBadgesSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;

