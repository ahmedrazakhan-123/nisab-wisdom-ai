import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card } from './ui/card';
import { X, Mail, Calculator, Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';

interface ExitIntentModalProps {
  isVisible: boolean;
  onClose: () => void;
}

export default function ExitIntentModal({ isVisible, onClose }: ExitIntentModalProps) {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const navigate = useNavigate();

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    // Here you would typically send to your email service
    console.log('Email captured:', email);
    setIsSubmitted(true);
    
    // Auto-close after success
    setTimeout(() => {
      onClose();
      setIsSubmitted(false);
      setEmail('');
    }, 2000);
  };

  const handleZakatCalculator = () => {
    onClose();
    navigate('/zakat-calculator');
  };

  const handleTryChat = () => {
    onClose();
    navigate('/chat');
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      
      <Card className="relative w-full max-w-md mx-4 bg-white dark:bg-card shadow-2xl border-0 overflow-hidden">
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="absolute top-4 right-4 z-10 h-8 w-8 text-muted-foreground hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </Button>

        {!isSubmitted ? (
          <div className="p-6 text-center">
            <div className="w-16 h-16 bg-brand-teal/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="h-8 w-8 text-brand-teal" />
            </div>
            
            <h2 className="text-2xl font-bold text-foreground mb-2">
              Before You Go...
            </h2>
            <p className="text-muted-foreground mb-6">
              Get your free Islamic Finance Guide and stay updated with halal investment insights.
            </p>

            <form onSubmit={handleEmailSubmit} className="space-y-4 mb-6">
              <Input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full"
                required
              />
              <Button
                type="submit"
                className="w-full bg-brand-teal hover:bg-brand-teal-light text-white"
              >
                Get Free Guide
              </Button>
            </form>

            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">Or try these popular features:</p>
              
              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  onClick={handleZakatCalculator}
                  className="flex flex-col items-center p-4 h-auto border-brand-teal/30 hover:bg-brand-teal/5"
                >
                  <Calculator className="h-5 w-5 text-brand-teal mb-1" />
                  <span className="text-xs">Zakat Calculator</span>
                </Button>
                
                <Button
                  variant="outline"
                  onClick={handleTryChat}
                  className="flex flex-col items-center p-4 h-auto border-brand-teal/30 hover:bg-brand-teal/5"
                >
                  <Star className="h-5 w-5 text-brand-teal mb-1" />
                  <span className="text-xs">Try AI Chat</span>
                </Button>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-border">
              <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
                <span>✓ No spam</span>
                <span>✓ Unsubscribe anytime</span>
                <span>✓ Islamic values</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-6 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Star className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">
              Thank You!
            </h2>
            <p className="text-muted-foreground">
              Check your email for the Islamic Finance Guide. 
              <br />
              Barakallahu feeki!
            </p>
          </div>
        )}
      </Card>
    </div>
  );
}