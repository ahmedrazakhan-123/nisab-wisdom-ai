
import React from 'react';
// Removed ShieldCheck, BookOpenText, Users as TrustBadge is removed
// Removed TrustBadge import

const TrustIndicatorsSection: React.FC = () => {
  // Removed indicators array

  return (
    <section 
      id="trust-indicators-section" 
      className="py-16 md:py-24 bg-cover bg-center relative text-white" // Added text-white for better contrast, adjust as needed
      style={{ 
        backgroundImage: "url('https://images.unsplash.com/photo-1466442929976-97f336a657be?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=1600')", // Using one of the suggested images
      }}
      aria-label="Section highlighting trust and accuracy with a background of Islamic architecture"
    >
      <div className="absolute inset-0 bg-black/60 dark:bg-black/70"></div> {/* Overlay for text legibility */}
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center md:text-left"> {/* Added text-center md:text-left for responsiveness */}
        {/* Content will be centered on small screens, left-aligned on medium and larger screens */}
        <div className="max-w-2xl mx-auto md:mx-0"> {/* Constrain width and center on small screens, align left on larger */}
          <h2 
            className="text-3xl md:text-4xl font-bold text-brand-teal-light mb-4 animate-fade-in-up" 
            style={{ fontFamily: "'Lora', serif" }}
          >
            Built on Trust & Accuracy
          </h2>
          <p className="text-gray-200 md:text-lg mb-6 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            Nisab.AI is committed to providing reliable and Shariah-compliant financial guidance. Our platform is rooted in authentic scholarship and verified by experts. We ensure our knowledge base is continuously updated and guided by a panel of Islamic finance specialists for accuracy and compliance.
          </p>
          {/* Removed the mapping of TrustBadge components */}
        </div>
        {/* Removed the separate image div that was on the right */}
      </div>
      {/* Removed the placeholder image text paragraph */}
    </section>
  );
};

export default TrustIndicatorsSection;
