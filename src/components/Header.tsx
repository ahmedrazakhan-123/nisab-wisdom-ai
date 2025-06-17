
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
  { name: 'Features', href: '/#features' },
  { name: 'Pricing', href: '/pricing' },
  { name: 'FAQ', href: '/#faq-section' },
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
    <header className="sticky top-0 z-50 bg-brand-cream/95 dark:bg-background/95 backdrop-blur-lg shadow-sm border-b border-brand-teal/10 transition-colors duration-300">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <a href="/" onClick={(e) => handleLinkClick(e, '/')} className="text-2xl font-bold text-brand-teal dark:text-brand-teal-light flex items-center gap-2" style={{ fontFamily: "'Lora', serif" }}>
          <div className="w-8 h-8 bg-brand-teal rounded-lg flex items-center justify-center text-white text-sm font-bold">N</div>
          Nisab<span className="text-brand-gold dark:text-brand-gold">.</span>AI
        </a>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          <NavigationMenu>
            <NavigationMenuList>
              {navItems.map((item) => (
                <NavigationMenuItem key={item.name}>
                  <NavigationMenuLink
                    href={item.href}
                    onClick={(e) => handleLinkClick(e, item.href)}
                    className={cn(navigationMenuTriggerStyle(), "bg-transparent hover:bg-brand-teal/10 text-brand-teal dark:text-brand-teal-light dark:hover:bg-brand-teal-light/10 hover:text-brand-teal-dark font-medium text-base")}
                  >
                    {item.name}
                  </NavigationMenuLink>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
          <div className="flex items-center space-x-4">
            <ThemeToggleButton />
            <Button 
              onClick={() => navigate('/chat')}
              className="bg-brand-teal hover:bg-brand-teal/90 text-white px-6 py-2 rounded-full font-medium"
            >
              Start Chat
            </Button>
          </div>
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
                <DrawerTitle className="text-xl font-bold text-brand-teal dark:text-brand-teal-light flex items-center gap-2" style={{ fontFamily: "'Lora', serif" }}>
                  <div className="w-6 h-6 bg-brand-teal rounded text-white text-xs font-bold flex items-center justify-center">N</div>
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
                    className="py-3 px-4 text-brand-teal dark:text-brand-teal-light hover:bg-brand-teal/10 dark:hover:bg-brand-teal-light/10 rounded-lg font-medium text-lg"
                  >
                    {item.name}
                  </a>
                ))}
              </nav>
              <DrawerFooter className="p-4 border-t border-brand-teal/20 dark:border-brand-teal-light/20">
                <Button
                  variant="default"
                  size="lg"
                  className="w-full bg-brand-teal hover:bg-brand-teal/90 text-white rounded-full"
                  onClick={() => handleMobileFooterClick('/chat')}
                >
                  Start Chat Now
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
