import HeroSection from '@/components/HeroSection';
import FeaturesSection from '@/components/FeaturesSection';
import HowItWorksSection from '@/components/HowItWorksSection';
import TrustBadgesSection from '@/components/TrustBadgesSection';
import Footer from '@/components/Footer';
// import ChatSection from '@/components/ChatSection'; // Removed ChatSection import
import InteractiveDemoSection from '@/components/InteractiveDemoSection';
import TrustIndicatorsSection from '@/components/TrustIndicatorsSection';
// import PricingSection from '@/components/PricingSection'; // Removed PricingSection import
import { Button } from '@/components/ui/button';
import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, navigationMenuTriggerStyle } from '@/components/ui/navigation-menu';
import { Drawer, DrawerClose, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger, DrawerFooter } from "@/components/ui/drawer";
import { cn } from '@/lib/utils';
import { Menu, X } from 'lucide-react';
import React, { useEffect } from 'react';
import ThemeToggleButton from '@/components/ThemeToggleButton';
import { useNavigate, useLocation } from 'react-router-dom';

const navItems = [
  { name: 'Chat', href: '/chat' },
  { name: 'Features', href: '#features' },
  { name: 'Demo', href: '#interactive-demo-section' },
  { name: 'Pricing', href: '/pricing' },
  { name: 'How It Works', href: '#how-it-works' },
  { name: 'Trust', href: '#trust-indicators-section' },
];

const Index = () => {
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state?.scrollTo) {
      const element = document.querySelector(location.state.scrollTo);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        // Clean up state to avoid re-scrolling on refresh
        window.history.replaceState({}, document.title);
      }
    }
  }, [location]);

  const handleLinkClick = (e: React.MouseEvent, href: string) => {
    e.preventDefault();
    if (href.startsWith('/')) {
        navigate(href);
        if (isDrawerOpen) {
            setIsDrawerOpen(false);
        }
        return;
    }

    const section = document.querySelector(href);
    if (section) {
      if (isDrawerOpen) {
        setIsDrawerOpen(false);
        // Timeout to allow drawer to close before scrolling
        setTimeout(() => section.scrollIntoView({ behavior: 'smooth' }), 150);
      } else {
        section.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handleMobileFooterClick = (path: string) => {
    setIsDrawerOpen(false);
    // Timeout to allow drawer to close before navigating
    setTimeout(() => navigate(path), 150);
  };

  return (
    <div className="flex flex-col min-h-screen bg-brand-cream dark:bg-background transition-colors duration-300">
      <header className="sticky top-0 z-50 bg-brand-cream/80 dark:bg-background/80 backdrop-blur-md shadow-sm transition-colors duration-300">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold text-brand-teal dark:text-brand-teal-light" style={{ fontFamily: "'Lora', serif" }}>
            Nisab<span className="text-brand-gold dark:text-brand-gold">.</span>AI
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2 lg:space-x-4">
            <NavigationMenu>
              <NavigationMenuList>
                {navItems.map((item) => (
                  <NavigationMenuItem key={item.name}>
                    <NavigationMenuLink
                      href={item.href}
                      onClick={(e) => handleLinkClick(e, item.href)}
                      className={cn(navigationMenuTriggerStyle(), "bg-transparent hover:bg-brand-teal/10 text-brand-teal dark:text-brand-teal-light dark:hover:bg-brand-teal-light/10 hover:text-brand-teal-dark font-medium text-sm lg:text-base")}
                    >
                      {item.name}
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
            <ThemeToggleButton />
            {/* "Get Started" button removed */}
          </div>

          {/* Mobile Navigation Trigger */}
          <div className="md:hidden flex items-center space-x-2">
            <ThemeToggleButton />
            <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
              <DrawerTrigger asChild>
                <Button variant="ghost" size="icon" className="text-brand-teal dark:text-brand-teal-light hover:bg-brand-teal/10 dark:hover:bg-brand-teal-light/10">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </DrawerTrigger>
              <DrawerContent className="bg-brand-cream dark:bg-background">
                <DrawerHeader className="flex justify-between items-center p-4">
                  <DrawerTitle className="text-xl font-bold text-brand-teal dark:text-brand-teal-light" style={{ fontFamily: "'Lora', serif" }}>
                    <span>Nisab<span className="text-brand-gold dark:text-brand-gold">.</span>AI</span>
                  </DrawerTitle>
                  <DrawerClose asChild>
                    <Button variant="ghost" size="icon" className="text-brand-teal dark:text-brand-teal-light hover:bg-brand-teal/10 dark:hover:bg-brand-teal-light/10">
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
                      onClick={(e) => handleLinkClick(e, item.href)}
                      className="py-2 px-3 text-brand-teal dark:text-brand-teal-light hover:bg-brand-teal/10 dark:hover:bg-brand-teal-light/10 rounded-md font-medium"
                    >
                      {item.name}
                    </a>
                  ))}
                </nav>
                <DrawerFooter className="p-4 border-t border-brand-teal/20 dark:border-brand-teal-light/20 flex flex-row gap-2">
                   <Button
                    variant="outline"
                    size="lg"
                    className="flex-1 border-brand-gold text-brand-teal hover:bg-brand-gold/10 rounded-full"
                    onClick={() => handleMobileFooterClick('/chat')}
                  >
                    Try Chatbot
                  </Button>
                  <Button
                    variant="default"
                    size="lg"
                    className="flex-1 bg-brand-gold hover:bg-brand-gold/90 text-brand-gold-foreground dark:bg-brand-gold dark:hover:bg-brand-gold/90 dark:text-brand-gold-foreground rounded-full"
                    onClick={() => handleMobileFooterClick('/pricing')}
                  >
                    View Plans
                  </Button>
                </DrawerFooter>
              </DrawerContent>
            </Drawer>
          </div>
        </div>
      </header>
      <main className="flex-grow">
        <HeroSection />
        {/* <ChatSection /> Removed ChatSection component */}
        <FeaturesSection />
        <InteractiveDemoSection />
        {/* <PricingSection /> Removed PricingSection component */}
        <HowItWorksSection />
        <TrustIndicatorsSection />
        <TrustBadgesSection /> {/* Keeping this for now, can be merged/removed later */}
      </main>
      <Footer />
    </div>
  );
};

export default Index;
