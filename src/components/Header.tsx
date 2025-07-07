
import React from 'react';
import { Button } from '@/components/ui/button';
import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, navigationMenuTriggerStyle } from '@/components/ui/navigation-menu';
import { Drawer, DrawerClose, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger, DrawerFooter } from "@/components/ui/drawer";
import { cn } from '@/lib/utils';
import { Menu, X } from 'lucide-react';
import ThemeToggleButton from '@/components/ThemeToggleButton';
import { useNavigate } from 'react-router-dom';

const navItems = [
  { name: 'Chat', href: '/chat' },
  { name: 'Zakat Calculator', href: '/zakat-calculator' },
  { name: 'Features', href: '/#features' },
  { name: 'Pricing', href: '/pricing' },
];

const Header = () => {
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);
  const navigate = useNavigate();

  const handleLinkClick = (e: React.MouseEvent, href: string) => {
    e.preventDefault();

    const navigateTo = () => {
      if (href.startsWith('/#')) {
        navigate('/', { state: { scrollTo: href.substring(1) } });
      } else {
        navigate(href);
      }
    };

    if (isDrawerOpen) {
      setIsDrawerOpen(false);
      setTimeout(navigateTo, 150);
    } else {
      navigateTo();
    }
  };

  const handleMobileFooterClick = (path: string) => {
    setIsDrawerOpen(false);
    setTimeout(() => navigate(path), 150);
  };

  return (
    <header className="sticky top-0 z-50 bg-brand-cream/80 dark:bg-background/80 backdrop-blur-md shadow-sm transition-colors duration-300">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <a href="/" onClick={(e) => handleLinkClick(e, '/')} className="text-2xl font-bold text-brand-teal dark:text-brand-teal-light" style={{ fontFamily: "'Lora', serif" }}>
          Nisab<span className="text-brand-gold dark:text-brand-gold">.</span>AI
        </a>

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
  );
};

export default Header;
