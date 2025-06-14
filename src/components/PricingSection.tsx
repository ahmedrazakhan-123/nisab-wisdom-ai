
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';

const plans = [
  {
    name: 'Basic',
    price: '$0',
    period: 'for personal use',
    description: 'Get started with our core features for free.',
    features: [
      'Access to core AI chat',
      'Standard knowledge base',
      'Community support',
      '10 queries per day',
    ],
    cta: 'Start for Free',
    variant: 'outline' as const,
  },
  {
    name: 'Pro',
    price: '$29',
    period: '/ month',
    description: 'For professionals and enthusiasts who need more power.',
    features: [
      'Everything in Basic',
      'Advanced AI models',
      'Priority email support',
      'Unlimited queries',
      'Access to premium knowledge sources',
    ],
    cta: 'Choose Pro',
    variant: 'default' as const,
    recommended: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    description: 'Tailored solutions for your organization.',
    features: [
      'Everything in Pro',
      'Dedicated account manager',
      'On-premise deployment options',
      'Custom integrations',
      'Team management features',
    ],
    cta: 'Contact Sales',
    variant: 'outline' as const,
  },
];

const PricingSection: React.FC = () => {
  return (
    <section id="pricing" className="py-16 md:py-24 bg-brand-cream/50 dark:bg-background/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-brand-teal dark:text-brand-teal-light" style={{ fontFamily: "'Lora', serif" }}>
            Find the perfect plan
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Start for free and scale as you grow. No credit card required for the basic plan.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
          {plans.map((plan) => (
            <Card key={plan.name} className={`flex flex-col relative ${plan.recommended ? 'border-brand-gold dark:border-brand-gold ring-2 ring-brand-gold/50 dark:ring-brand-gold/50' : 'border-border'}`}>
              {plan.recommended && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-brand-gold text-brand-gold-foreground px-3 py-1 text-sm font-semibold rounded-full">
                  Most Popular
                </div>
              )}
              <CardHeader className="pt-8">
                <CardTitle className="text-brand-teal dark:text-brand-teal-light">{plan.name}</CardTitle>
                <CardDescription className="!mt-2 flex items-baseline">
                  <span className="text-3xl font-bold text-foreground">{plan.price}</span>
                  <span className="text-muted-foreground ml-1">{plan.period}</span>
                </CardDescription>
                <p className="text-muted-foreground pt-2 text-sm !mt-2">{plan.description}</p>
              </CardHeader>
              <CardContent className="flex-grow">
                <ul className="space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start">
                      <Check className="h-5 w-5 text-brand-teal dark:text-brand-teal-light mr-2 shrink-0 mt-1" />
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button className="w-full" variant={plan.variant}>
                  {plan.cta}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
