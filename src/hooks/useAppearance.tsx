
import { useState, useEffect } from 'react';

export type FontSetting = 'default' | 'serif' | 'mono' | 'roboto' | 'open-sans' | 'poppins';
export type ColorSetting = 'default' | 'blue' | 'green' | 'purple';
export type TextSizeSetting = 'sm' | 'base' | 'lg' | 'xl';

const FONT_CLASSES: Record<FontSetting, string> = {
  default: 'font-sans',
  serif: 'font-serif',
  mono: 'font-mono',
  roboto: 'font-roboto',
  'open-sans': 'font-open-sans',
  poppins: 'font-poppins',
};

const ACCENT_COLORS: Record<ColorSetting, Record<string, string>> = {
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

const TEXT_SIZES: Record<TextSizeSetting, string> = {
  sm: '14px',
  base: '16px',
  lg: '18px',
  xl: '20px',
};

const applyBodyFont = (font: FontSetting) => {
    Object.values(FONT_CLASSES).forEach(cls => {
        if(cls) document.body.classList.remove(cls);
    });
    if (FONT_CLASSES[font]) {
        document.body.classList.add(FONT_CLASSES[font]);
    }
};

const applyAccentColor = (color: ColorSetting) => {
    const root = document.documentElement;
    const colorsToApply = ACCENT_COLORS[color];

    const allAccentKeys = new Set(Object.values(ACCENT_COLORS).flatMap(Object.keys));
    allAccentKeys.forEach(key => root.style.removeProperty(key));

    Object.entries(colorsToApply).forEach(([key, value]) => {
        root.style.setProperty(key, value);
    });
};

const applyTextSize = (size: TextSizeSetting) => {
    document.documentElement.style.fontSize = TEXT_SIZES[size];
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

        applyBodyFont(initialFont);
        applyAccentColor(initialColor);
        applyTextSize(initialTextSize);
    }, []);

    const handleSetFont = (newFont: FontSetting) => {
        setFont(newFont);
        localStorage.setItem('app-font', newFont);
        applyBodyFont(newFont);
    };

    const handleSetColor = (newColor: ColorSetting) => {
        setColor(newColor);
        localStorage.setItem('app-color', newColor);
        applyAccentColor(newColor);
    };
    
    const handleSetTextSize = (newSize: TextSizeSetting) => {
        setTextSize(newSize);
        localStorage.setItem('app-text-size', newSize);
        applyTextSize(newSize);
    };

    return { font, color, textSize, setFont: handleSetFont, setColor: handleSetColor, setTextSize: handleSetTextSize };
}
