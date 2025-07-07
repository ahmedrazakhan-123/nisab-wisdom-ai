
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PricingSection from '@/components/PricingSection';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, navigationMenuTriggerStyle } from '@/components/ui/navigation-menu';
import { Drawer, DrawerClose, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { cn } from '@/lib/utils';
import { Menu, X, ArrowLeft } from 'lucide-react';
import ThemeToggleButton from '@/components/ThemeToggleButton';

const navItems = [
  { name: 'Home', href: '/' },
  { name: 'Chat', href: '/chat' },
  { name: 'Zakat Calculator', href: '/zakat-calculator' },
  { name: 'Features', href: '/#features' },
  { name: 'Pricing', href: '/pricing' },
];

const PricingPage: React.FC = () => {
    const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);
    const navigate = useNavigate();

    const handleLinkClick = (e: React.MouseEvent, href: string) => {
        e.preventDefault();

        const performNavigation = () => {
            if (href.startsWith('/#')) {
                const hash = href.substring(1); // e.g., '#features'
                navigate('/', { state: { scrollTo: hash } });
            } else {
                navigate(href);
            }
        };

        if (isDrawerOpen) {
            setIsDrawerOpen(false);
            // Timeout to allow drawer to close before navigating
            setTimeout(performNavigation, 150);
        } else {
            performNavigation();
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-brand-cream dark:bg-background transition-colors duration-300">
            <header className="sticky top-0 z-50 bg-brand-cream/80 dark:bg-background/80 backdrop-blur-md shadow-sm transition-colors duration-300">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                    <Link to="/" className="flex items-center gap-2 text-2xl font-bold text-brand-teal dark:text-brand-teal-light hover:text-brand-teal-dark dark:hover:text-brand-teal-light/80 transition-colors" style={{ fontFamily: "'Lora', serif" }}>
                        <ArrowLeft className="h-6 w-6" />
                        <span>Nisab<span className="text-brand-gold dark:text-brand-gold">.</span>AI</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-2 lg:space-x-4">
                        <NavigationMenu>
                            <NavigationMenuList>
                                {navItems.map((item) => (
                                    <NavigationMenuItem key={item.name}>
                                        <NavigationMenuLink 
                                            href={item.href} 
                                            onClick={(e) => handleLinkClick(e, item.href)}
                                            className={cn(navigationMenuTriggerStyle(), "cursor-pointer bg-transparent hover:bg-brand-teal/10 text-brand-teal dark:text-brand-teal-light dark:hover:bg-brand-teal-light/10 hover:text-brand-teal-dark font-medium text-sm lg:text-base")}>
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
                              <Link to="/" onClick={() => setIsDrawerOpen(false)} className="flex items-center gap-2">
                                <ArrowLeft className="h-5 w-5" />
                                <span>Nisab<span className="text-brand-gold dark:text-brand-gold">.</span>AI</span>
                              </Link>
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
