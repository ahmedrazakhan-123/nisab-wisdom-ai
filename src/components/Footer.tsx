
import React from 'react';
import { Linkedin, Twitter, Mail, Phone, MapPin, BookOpen, Calculator, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Main Footer */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-brand-teal rounded-lg flex items-center justify-center text-white text-sm font-bold">N</div>
              <h3 className="text-xl font-bold text-white" style={{ fontFamily: "'Lora', serif" }}>
                Nisab<span className="text-brand-gold">.</span>AI
              </h3>
            </div>
            <p className="text-gray-400 mb-6 leading-relaxed">
              Your trusted AI companion for Shariah-compliant financial guidance. Making Islamic finance accessible to everyone.
            </p>
            <div className="flex space-x-4">
              <a href="#" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-brand-gold transition-colors p-2 rounded-lg hover:bg-gray-800">
                <Twitter size={20} />
              </a>
              <a href="#" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-brand-gold transition-colors p-2 rounded-lg hover:bg-gray-800">
                <Linkedin size={20} />
              </a>
              <a href="mailto:contact@nisab.ai" className="text-gray-400 hover:text-brand-gold transition-colors p-2 rounded-lg hover:bg-gray-800">
                <Mail size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-6">Platform</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/chat" className="text-gray-400 hover:text-brand-gold transition-colors flex items-center gap-2">
                  <MessageSquare size={16} />
                  AI Chat Assistant
                </Link>
              </li>
              <li>
                <Link to="/zakat-calculator" className="text-gray-400 hover:text-brand-gold transition-colors flex items-center gap-2">
                  <Calculator size={16} />
                  Zakat Calculator
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="text-gray-400 hover:text-brand-gold transition-colors">
                  Pricing Plans
                </Link>
              </li>
              <li>
                <a href="/#features" className="text-gray-400 hover:text-brand-gold transition-colors">
                  Features
                </a>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-6">Resources</h4>
            <ul className="space-y-3">
              <li>
                <a href="/#faq-section" className="text-gray-400 hover:text-brand-gold transition-colors">
                  FAQ
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-brand-gold transition-colors flex items-center gap-2">
                  <BookOpen size={16} />
                  Islamic Finance Guide
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-brand-gold transition-colors">
                  Scholarly References
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-brand-gold transition-colors">
                  Community Forum
                </a>
              </li>
            </ul>
          </div>

          {/* Contact & Legal */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-6">Support</h4>
            <ul className="space-y-3">
              <li>
                <a href="mailto:support@nisab.ai" className="text-gray-400 hover:text-brand-gold transition-colors flex items-center gap-2">
                  <Mail size={16} />
                  support@nisab.ai
                </a>
              </li>
              <li>
                <a href="#privacy" className="text-gray-400 hover:text-brand-gold transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#terms" className="text-gray-400 hover:text-brand-gold transition-colors">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#disclaimer" className="text-gray-400 hover:text-brand-gold transition-colors">
                  Islamic Finance Disclaimer
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-center md:text-left">
              <p className="text-sm text-gray-400">
                &copy; {new Date().getFullYear()} Nisab AI. All rights reserved.
              </p>
              <p className="text-xs text-gray-500 mt-1">
                For informational purposes only. Consult qualified scholars for binding religious rulings.
              </p>
            </div>
            
            <div className="flex items-center space-x-6 text-xs text-gray-500">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Halal Certified</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Scholar Reviewed</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Authentic Sources</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
