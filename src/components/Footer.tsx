
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-gray-300 py-8 text-center">
      <div className="container mx-auto">
        <p className="text-sm">
          &copy; {new Date().getFullYear()} Nisab AI. All rights reserved.
        </p>
        <p className="text-xs mt-2">
          Financial advice provided by Nisab AI is for informational purposes only and should not be considered as professional financial advice.
        </p>
      </div>
    </footer>
  );
};

export default Footer;

