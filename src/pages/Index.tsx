
import HeroSection from '@/components/HeroSection';
import FeaturesSection from '@/components/FeaturesSection';
import HowItWorksSection from '@/components/HowItWorksSection';
import TrustBadgesSection from '@/components/TrustBadgesSection';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, navigationMenuTriggerStyle } from '@/components/ui/navigation-menu';
import { cn } from '@/lib/utils';

const navItems = [
  { name: 'Features', href: '#features' },
  { name: 'How It Works', href: '#how-it-works' },
  // { name: 'Pricing', href: '#pricing' }, // Example for future
];

const Index = () => {
  return (
    <div className="flex flex-col min-h-screen bg-brand-cream">
      <header className="sticky top-0 z-50 bg-brand-cream/80 backdrop-blur-md shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold text-brand-teal" style={{ fontFamily: "'Lora', serif" }}>
            Nisab<span className="text-brand-gold">.</span>AI
          </div>
          <div className="flex items-center space-x-4">
            <NavigationMenu>
              <NavigationMenuList>
                {navItems.map((item) => (
                  <NavigationMenuItem key={item.name}>
                    <NavigationMenuLink 
                      href={item.href}
                      className={cn(navigationMenuTriggerStyle(), "bg-transparent hover:bg-brand-teal/10 text-brand-teal hover:text-brand-teal-dark font-medium")}
                    >
                      {item.name}
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
            <Button variant="default" size="sm" className="bg-brand-gold hover:bg-brand-gold/90 text-brand-gold-foreground rounded-full px-6">
              Get Started
            </Button>
          </div>
        </div>
      </header>
      <main className="flex-grow">
        <HeroSection />
        <FeaturesSection />
        <HowItWorksSection />
        <TrustBadgesSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
