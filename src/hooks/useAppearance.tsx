
import { useState, useEffect } from 'react';

export type FontSetting = 'default' | 'serif' | 'mono' | 'roboto' | 'open-sans' | 'poppins';
export type ColorSetting = 'default' | 'blue' | 'green' | 'purple';
export type TextSizeSetting = 'sm' | 'base' | 'lg' | 'xl';

export const FONT_CLASSES: Record<FontSetting, string> = {
  default: 'font-sans',
  serif: 'font-serif',
  mono: 'font-mono',
  roboto: 'font-roboto',
  'open-sans': 'font-open-sans',
  poppins: 'font-poppins',
};

export const ACCENT_COLORS: Record<ColorSetting, Record<string, string>> = {
    default: {},
    blue: {
        '--primary': 'hsl(217.2 91.2% 59.8%)',
        '--primary-foreground': 'hsl(210 40% 98%)',
        '--ring': 'hsl(217.2 91.2% 59.8%)',
        '--brand-gold': 'hsl(217.2 91.2% 59.8%)',
    },
    green: {
        '--primary': 'hsl(142.1 76.2% 36.3%)',
        '--primary-foreground': 'hsl(142.1 76.2% 96.3%)',
        '--ring': 'hsl(142.1 76.2% 36.3%)',
        '--brand-gold': 'hsl(142.1 76.2% 36.3%)',
    },
    purple: {
        '--primary': 'hsl(262.1 83.3% 57.8%)',
        '--primary-foreground': 'hsl(262.1 83.3% 97.8%)',
        '--ring': 'hsl(262.1 83.3% 57.8%)',
        '--brand-gold': 'hsl(262.1 83.3% 57.8%)',
    }
};

export const TEXT_SIZE_CLASSES: Record<TextSizeSetting, string> = {
  sm: 'text-sm',
  base: 'text-base',
  lg: 'text-lg',
  xl: 'text-xl',
};

export function useAppearance() {
    const [font, setFont] = useState<FontSetting>('default');
    const [color, setColor] = useState<ColorSetting>('default');
    const [textSize, setTextSize] = useState<TextSizeSetting>('base');

    useEffect(() => {
        const savedFont = localStorage.getItem('app-font') as FontSetting | null;
        const savedColor = localStorage.getItem('app-color') as ColorSetting | null;
        const savedTextSize = localStorage.getItem('app-text-size') as TextSizeSetting | null;

        const initialFont = savedFont || 'default';
        const initialColor = savedColor || 'default';
        const initialTextSize = savedTextSize || 'base';
        
        setFont(initialFont);
        setColor(initialColor);
        setTextSize(initialTextSize);
    }, []);

    const handleSetFont = (newFont: FontSetting) => {
        setFont(newFont);
        localStorage.setItem('app-font', newFont);
    };

    const handleSetColor = (newColor: ColorSetting) => {
        setColor(newColor);
        localStorage.setItem('app-color', newColor);
    };
    
    const handleSetTextSize = (newSize: TextSizeSetting) => {
        setTextSize(newSize);
        localStorage.setItem('app-text-size', newSize);
    };

    return { font, color, textSize, setFont: handleSetFont, setColor: handleSetColor, setTextSize: handleSetTextSize };
}
