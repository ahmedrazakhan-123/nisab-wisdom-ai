
import React from 'react';
import { Linkedin, Twitter } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-gray-300 py-8 sm:py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 text-center sm:text-left">
          {/* Brand Section */}
          <div className="order-1 sm:order-1">
            <h3 className="text-lg sm:text-xl font-semibold text-white mb-3" style={{ fontFamily: "'Lora', serif" }}>
              Nisab<span className="text-brand-gold">.</span>AI
            </h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              Your AI companion for Islamic finance.
            </p>
          </div>
          
          {/* Quick Links Section */}
          <div className="order-2 sm:order-2">
            <h4 className="text-md font-semibold text-white mb-3">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <a href="#features" className="hover:text-brand-gold transition-colors text-sm sm:text-base">
                  Features
                </a>
              </li>
              <li>
                <a href="#how-it-works" className="hover:text-brand-gold transition-colors text-sm sm:text-base">
                  How It Works
                </a>
              </li>
              <li>
                <a href="/zakat-calculator" className="hover:text-brand-gold transition-colors text-sm sm:text-base">
                  Zakat Calculator
                </a>
              </li>
              <li>
                <a href="/chat" className="hover:text-brand-gold transition-colors text-sm sm:text-base">
                  AI Chat
                </a>
              </li>
            </ul>
          </div>
          
          {/* Legal & Social Section */}
          <div className="order-3 sm:order-3">
            <h4 className="text-md font-semibold text-white mb-3">Legal</h4>
            <ul className="space-y-2 mb-4">
              <li>
                <a href="#privacy" className="hover:text-brand-gold transition-colors text-sm sm:text-base">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#terms" className="hover:text-brand-gold transition-colors text-sm sm:text-base">
                  Terms of Service
                </a>
              </li>
            </ul>
            
            {/* Social Links */}
            <div className="flex justify-center sm:justify-start space-x-4">
              <a 
                href="#" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-gray-400 hover:text-brand-gold transition-colors p-2 hover:bg-gray-700 rounded-lg"
                aria-label="Follow us on Twitter"
              >
                <Twitter size={18} />
              </a>
              <a 
                href="#" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-gray-400 hover:text-brand-gold transition-colors p-2 hover:bg-gray-700 rounded-lg"
                aria-label="Follow us on LinkedIn"
              >
                <Linkedin size={18} />
              </a>
            </div>
          </div>
        </div>
        
        {/* Bottom Section */}
        <div className="border-t border-gray-700 mt-6 sm:mt-8 pt-6 sm:pt-8 text-center">
          <p className="text-sm sm:text-base">
            &copy; {new Date().getFullYear()} Nisab AI. All rights reserved.
          </p>
          <p className="text-xs sm:text-sm text-gray-500 mt-2 max-w-2xl mx-auto leading-relaxed">
            Financial advice provided by Nisab AI is for informational purposes only and should not be considered as professional financial advice.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
