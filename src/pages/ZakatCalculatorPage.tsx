
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ZakatCalculator from '@/components/widgets/ZakatCalculator';

const ZakatCalculatorPage = () => {
  return (
    <div className="flex flex-col min-h-screen bg-brand-cream dark:bg-background transition-colors duration-300">
      <Header />
      <main className="flex-grow py-6 sm:py-8 md:py-12 lg:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            {/* Page Header */}
            <div className="text-center mb-8 sm:mb-12 animate-fade-in-up">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-brand-teal dark:text-brand-teal-light mb-3 sm:mb-4" style={{ fontFamily: "'Lora', serif" }}>
                Zakat Calculator
              </h1>
              <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed px-4">
                An easy way to calculate your annual Zakat. Our comprehensive calculator includes various asset types to ensure accuracy based on the Nisab threshold.
              </p>
            </div>
            
            {/* Calculator Component */}
            <ZakatCalculator />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ZakatCalculatorPage;
