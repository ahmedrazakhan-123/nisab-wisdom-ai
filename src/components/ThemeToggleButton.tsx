
import React from 'react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { Palette, Sun, Moon, Check } from 'lucide-react'; // Palette can be kept or changed
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const ThemeToggleButton: React.FC = () => {
  const { theme, setTheme, resolvedTheme } = useTheme();

  const themes = [
    { name: 'Light', value: 'light', Icon: Sun },
    { name: 'Dark', value: 'dark', Icon: Moon }, // This will now be the ChatGPT-like dark theme
    { name: 'Graphite', value: 'black', Icon: Moon }, // This was 'Black', now 'Graphite', uses the previous .dark styles
  ];

  // Determine which icon to display on the button itself.
  // Using Palette as a generic theme icon for the trigger.
  const TriggerIcon = Palette;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Select theme"
          className="text-foreground/70 hover:text-foreground hover:bg-accent" // General styling
        >
          <TriggerIcon className="h-5 w-5" />
          <span className="sr-only">Select theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {themes.map((item) => (
          <DropdownMenuItem
            key={item.value}
            onClick={() => setTheme(item.value)}
            className="flex items-center justify-between"
          >
            <div className="flex items-center">
              <item.Icon className="mr-2 h-4 w-4" />
              <span>{item.name}</span>
            </div>
            {(theme === item.value || (item.value === resolvedTheme && theme === 'system')) && <Check className="ml-2 h-4 w-4" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ThemeToggleButton;
