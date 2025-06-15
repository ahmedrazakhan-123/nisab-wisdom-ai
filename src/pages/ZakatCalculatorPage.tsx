
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ZakatCalculator from '@/components/widgets/ZakatCalculator';

const ZakatCalculatorPage = () => {
  return (
    <div className="flex flex-col min-h-screen bg-brand-cream dark:bg-background transition-colors duration-300">
      <Header />
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12 animate-fade-in-up">
            <h1 className="text-4xl md:text-5xl font-bold text-brand-teal dark:text-brand-teal-light mb-4" style={{ fontFamily: "'Lora', serif" }}>
              Zakat Calculator
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              An easy way to calculate your annual Zakat. Our comprehensive calculator includes various asset types to ensure accuracy based on the Nisab threshold.
            </p>
          </div>
          <ZakatCalculator />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ZakatCalculatorPage;
