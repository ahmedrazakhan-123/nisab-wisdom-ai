import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Crown, Zap, Shield, Star, ArrowRight, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface FeatureRevealProps {
  trigger: 'chat_limit' | 'homepage_scroll' | 'calculator_usage';
  queryCount?: number;
}

const premiumFeatures = [
  {
    icon: Crown,
    title: "Unlimited AI Conversations",
    description: "Ask unlimited questions about Islamic finance",
    value: "No daily limits"
  },
  {
    icon: Zap,
    title: "Advanced Fatwa Database",
    description: "Access to 10,000+ scholarly opinions",
    value: "Comprehensive research"
  },
  {
    icon: Shield,
    title: "Portfolio Screening",
    description: "Real-time halal investment monitoring",
    value: "Automated alerts"
  },
  {
    icon: Star,
    title: "Personal Scholar Support",
    description: "Direct access to certified scholars",
    value: "Expert guidance"
  }
];

const urgencyMessages = [
  "50 users upgraded today",
  "Limited time: Ramadan special pricing",
  "Join 1,247 premium members",
  "Save 40% on annual plans"
];

export default function ProgressiveFeatureReveal({ trigger, queryCount = 0 }: FeatureRevealProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [currentUrgency, setCurrentUrgency] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    let shouldShow = false;

    switch (trigger) {
      case 'chat_limit':
        shouldShow = queryCount >= 5;
        break;
      case 'homepage_scroll':
        // This would be triggered by scroll behavior in parent component
        shouldShow = true;
        break;
      case 'calculator_usage':
        shouldShow = true;
        break;
    }

    if (shouldShow) {
      const timer = setTimeout(() => setIsVisible(true), 1000);
      return () => clearTimeout(timer);
    }
  }, [trigger, queryCount]);

  useEffect(() => {
    if (isVisible) {
      const interval = setInterval(() => {
        setCurrentUrgency(prev => (prev + 1) % urgencyMessages.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [isVisible]);

  const getTitle = () => {
    switch (trigger) {
      case 'chat_limit':
        return `You've used ${queryCount}/5 free questions today`;
      case 'calculator_usage':
        return "Unlock Advanced Zakat Features";
      default:
        return "Unlock Premium Features";
    }
  };

  const getDescription = () => {
    switch (trigger) {
      case 'chat_limit':
        return "Upgrade to continue your Islamic finance journey with unlimited AI assistance";
      case 'calculator_usage':
        return "Get comprehensive Zakat calculations with detailed breakdowns and historical tracking";
      default:
        return "Take your Islamic finance knowledge to the next level with premium features";
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsVisible(false)} />
      
      <Card className="relative w-full max-w-2xl bg-white dark:bg-card shadow-2xl border-0 overflow-hidden">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsVisible(false)}
          className="absolute top-4 right-4 z-10 h-8 w-8 text-muted-foreground hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </Button>

        <div className="p-8">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-brand-teal to-brand-teal-light rounded-full flex items-center justify-center mx-auto mb-4">
              <Crown className="h-8 w-8 text-white" />
            </div>
            
            <h2 className="text-2xl font-bold text-foreground mb-2">
              {getTitle()}
            </h2>
            <p className="text-muted-foreground">
              {getDescription()}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {premiumFeatures.map((feature, index) => (
              <div key={feature.title} className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 dark:bg-muted/20">
                <div className="w-8 h-8 bg-brand-teal/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <feature.icon className="h-4 w-4 text-brand-teal" />
                </div>
                <div>
                  <h3 className="font-medium text-sm text-foreground">{feature.title}</h3>
                  <p className="text-xs text-muted-foreground">{feature.description}</p>
                  <Badge variant="outline" className="mt-1 text-xs">
                    {feature.value}
                  </Badge>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-2 bg-brand-teal/10 text-brand-teal px-4 py-2 rounded-full text-sm font-medium animate-pulse">
              <Star className="h-4 w-4" />
              {urgencyMessages[currentUrgency]}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={() => navigate('/pricing')}
              className="flex-1 bg-brand-teal hover:bg-brand-teal-light text-white"
            >
              View Pricing Plans
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
            <Button
              variant="outline"
              onClick={() => setIsVisible(false)}
              className="flex-1"
            >
              Continue with Free
            </Button>
          </div>

          <div className="mt-4 text-center">
            <p className="text-xs text-muted-foreground">
              30-day money-back guarantee • Cancel anytime • Islamic values guaranteed
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}