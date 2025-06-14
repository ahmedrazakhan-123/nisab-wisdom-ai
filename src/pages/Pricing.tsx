
import React from 'react';
import { Link } from 'react-router-dom';
import PricingSection from '@/components/PricingSection';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, navigationMenuTriggerStyle } from '@/components/ui/navigation-menu';
import { Drawer, DrawerClose, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { cn } from '@/lib/utils';
import { Menu, X } from 'lucide-react';
import ThemeToggleButton from '@/components/ThemeToggleButton';

const navItems = [
  { name: 'Features', href: '/#features' },
  { name: 'Demo', href: '/#interactive-demo-section' },
  { name: 'Pricing', href: '/pricing' },
  { name: 'How It Works', href: '/#how-it-works' },
  { name: 'Trust', href: '/#trust-indicators-section' },
];

const PricingPage: React.FC = () => {
    const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);

    return (
        <div className="flex flex-col min-h-screen bg-brand-cream dark:bg-background transition-colors duration-300">
            <header className="sticky top-0 z-50 bg-brand-cream/80 dark:bg-background/80 backdrop-blur-md shadow-sm transition-colors duration-300">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                    <Link to="/" className="text-2xl font-bold text-brand-teal dark:text-brand-teal-light" style={{ fontFamily: "'Lora', serif" }}>
                        Nisab<span className="text-brand-gold dark:text-brand-gold">.</span>AI
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-2 lg:space-x-4">
                        <NavigationMenu>
                            <NavigationMenuList>
                                {navItems.map((item) => (
                                    <NavigationMenuItem key={item.name}>
                                        <NavigationMenuLink href={item.href} className={cn(navigationMenuTriggerStyle(), "bg-transparent hover:bg-brand-teal/10 text-brand-teal dark:text-brand-teal-light dark:hover:bg-brand-teal-light/10 hover:text-brand-teal-dark font-medium text-sm lg:text-base")}>
                                            {item.name}
                                        </NavigationMenuLink>
                                    </NavigationMenuItem>
                                ))}
                            </NavigationMenuList>
                        </NavigationMenu>
                        <ThemeToggleButton />
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
                              <Link to="/" onClick={() => setIsDrawerOpen(false)}>Nisab<span className="text-brand-gold dark:text-brand-gold">.</span>AI</Link>
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
                                onClick={() => setIsDrawerOpen(false)}
                                className="py-2 px-3 text-brand-teal dark:text-brand-teal-light hover:bg-brand-teal/10 dark:hover:bg-brand-teal-light/10 rounded-md font-medium"
                              >
                                {item.name}
                              </a>
                            ))}
                          </nav>
                        </DrawerContent>
                      </Drawer>
                    </div>
                </div>
            </header>
            <main className="flex-grow">
                <PricingSection />
            </main>
            <Footer />
        </div>
    );
};

export default PricingPage;
