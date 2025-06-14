
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ThemeToggleButton from './ThemeToggleButton';
import { Drawer, DrawerClose, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";

const navItems = [
  { name: 'Home', href: '/' },
  { name: 'Features', href: '/#features' },
  { name: 'Demo', href: '/#interactive-demo-section' },
  { name: 'Pricing', href: '/pricing' },
  { name: 'How It Works', href: '/#how-it-works' },
  { name: 'Trust', href: '/#trust-indicators-section' },
];

const ChatHeader = () => {
    const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);
    const navigate = useNavigate();

    const handleLinkClick = (href: string) => {
        setIsDrawerOpen(false);
        if (href.startsWith('/#')) {
            const hash = href.substring(1);
            navigate('/', { state: { scrollTo: hash } });
        } else {
            navigate(href);
        }
    };

    return (
        <header className="sticky top-0 z-50 bg-brand-cream/80 dark:bg-background/80 backdrop-blur-md shadow-sm transition-colors duration-300">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                <Link to="/" className="flex items-center gap-2 text-2xl font-bold text-brand-teal dark:text-brand-teal-light hover:text-brand-teal-dark dark:hover:text-brand-teal-light/80 transition-colors" style={{ fontFamily: "'Lora', serif" }}>
                    <ArrowLeft className="h-6 w-6" />
                    <span>Nisab<span className="text-brand-gold dark:text-brand-gold">.</span>AI</span>
                </Link>

                <div className="flex items-center space-x-2">
                    <ThemeToggleButton />
                    <div className="md:hidden">
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
                                        <span>Navigation</span>
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
                                            onClick={(e) => { e.preventDefault(); handleLinkClick(item.href); }}
                                            className="cursor-pointer py-2 px-3 text-brand-teal dark:text-brand-teal-light hover:bg-brand-teal/10 dark:hover:bg-brand-teal-light/10 rounded-md font-medium"
                                        >
                                            {item.name}
                                        </a>
                                    ))}
                                </nav>
                            </DrawerContent>
                        </Drawer>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default ChatHeader;
