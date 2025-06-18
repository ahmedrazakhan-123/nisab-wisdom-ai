
import React from 'react';
import { Linkedin, Twitter } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-gray-300 py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          <div>
            <h3 className="text-lg font-semibold text-white mb-3" style={{ fontFamily: "'Lora', serif" }}>Nisab<span className="text-brand-gold">.</span>AI</h3>
            <p className="text-sm text-gray-400">
              Your AI companion for Islamic finance.
            </p>
          </div>
          <div>
            <h4 className="text-md font-semibold text-white mb-3">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="#features" className="hover:text-brand-gold transition-colors">Features</a></li>
              <li><a href="#how-it-works" className="hover:text-brand-gold transition-colors">How It Works</a></li>
              {/* Add more links as needed */}
            </ul>
          </div>
          <div>
            <h4 className="text-md font-semibold text-white mb-3">Legal</h4>
            <ul className="space-y-2">
              <li><a href="#privacy" className="hover:text-brand-gold transition-colors">Privacy Policy</a></li>
              <li><a href="#terms" className="hover:text-brand-gold transition-colors">Terms of Service</a></li>
            </ul>
            <div className="mt-4 flex justify-center md:justify-start space-x-4">
              <a href="#" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-brand-gold transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-brand-gold transition-colors">
                <Linkedin size={20} />
              </a>
              {/* Add more social icons as needed */}
            </div>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-8 text-center">
          <p className="text-sm">
            &copy; {new Date().getFullYear()} Nisab AI. All rights reserved.
          </p>
          <p className="text-xs text-gray-500 mt-2">
            Financial advice provided by Nisab AI is for informational purposes only and should not be considered as professional financial advice.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
