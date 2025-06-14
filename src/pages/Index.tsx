
import HeroSection from '@/components/HeroSection';
import FeaturesSection from '@/components/FeaturesSection';
import HowItWorksSection from '@/components/HowItWorksSection';
import TrustBadgesSection from '@/components/TrustBadgesSection';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, navigationMenuTriggerStyle } from '@/components/ui/navigation-menu';
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { cn } from '@/lib/utils';
import { Menu, X } from 'lucide-react';
import React from 'react';

const navItems = [
  { name: 'Features', href: '#features' },
  { name: 'How It Works', href: '#how-it-works' },
  // { name: 'Pricing', href: '#pricing' }, // Example for future
];

const Index = () => {
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);

  return (
    <div className="flex flex-col min-h-screen bg-brand-cream">
      <header className="sticky top-0 z-50 bg-brand-cream/80 backdrop-blur-md shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold text-brand-teal" style={{ fontFamily: "'Lora', serif" }}>
            Nisab<span className="text-brand-gold">.</span>AI
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
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

          {/* Mobile Navigation Trigger */}
          <div className="md:hidden">
            <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
              <DrawerTrigger asChild>
                <Button variant="ghost" size="icon" className="text-brand-teal hover:bg-brand-teal/10">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </DrawerTrigger>
              <DrawerContent className="bg-brand-cream">
                <DrawerHeader className="flex justify-between items-center p-4">
                  <DrawerTitle className="text-xl font-bold text-brand-teal" style={{ fontFamily: "'Lora', serif" }}>
                    Nisab<span className="text-brand-gold">.</span>AI
                  </DrawerTitle>
                  <DrawerClose asChild>
                    <Button variant="ghost" size="icon" className="text-brand-teal hover:bg-brand-teal/10">
                      <X className="h-6 w-6" />
                      <span className="sr-only">Close menu</span>
                    </Button>
                  </DrawerClose>
                </DrawerHeader>
                <nav className="flex flex-col p-4 space-y-2">
                  {navItems.map((item) => (
                    <a
                      key={item.name}
                      href={item.href}
                      onClick={() => setIsDrawerOpen(false)}
                      className="py-2 px-3 text-brand-teal hover:bg-brand-teal/10 rounded-md font-medium"
                    >
                      {item.name}
                    </a>
                  ))}
                </nav>
                <DrawerFooter className="p-4 border-t border-brand-teal/20">
                  <Button
                    variant="default"
                    size="lg"
                    className="w-full bg-brand-gold hover:bg-brand-gold/90 text-brand-gold-foreground rounded-full"
                    onClick={() => setIsDrawerOpen(false)}
                  >
                    Get Started
                  </Button>
                </DrawerFooter>
              </DrawerContent>
            </Drawer>
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
