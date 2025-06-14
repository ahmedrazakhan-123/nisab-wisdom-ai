
import React from 'react';
import InteractiveDemo from './InteractiveDemo';

const InteractiveDemoSection: React.FC = () => {
  return (
    <section id="interactive-demo-section" className="py-16 md:py-24 bg-brand-teal/5">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <InteractiveDemo />
      </div>
    </section>
  );
};

export default InteractiveDemoSection;
