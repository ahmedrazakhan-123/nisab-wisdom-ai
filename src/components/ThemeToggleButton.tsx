
import React from 'react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { Palette, Sun, Moon, Check } from 'lucide-react';
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
    { name: 'Dark', value: 'dark', Icon: Moon }, // 'dark' is our Graphite theme
    { name: 'Black', value: 'black', Icon: Moon }, // 'black' is the new pure black theme
  ];

  // Determine which icon to display on the button itself.
  // It could be Palette, or change based on resolvedTheme.
  // Let's use Palette for the trigger.
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
            {/* Show checkmark for the currently active theme.
                Note: `theme` can be 'system'. `resolvedTheme` gives actual 'light' or 'dark'.
                We compare against `item.value`. If `theme` is 'system', `resolvedTheme` helps.
            */}
            {(theme === item.value || (item.value === resolvedTheme && theme === 'system')) && <Check className="ml-2 h-4 w-4" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ThemeToggleButton;
