import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useAppearance, FontSetting, ColorSetting, TextSizeSetting } from '@/hooks/useAppearance';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SettingsModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

const fonts: { name: string, value: FontSetting, className?: string }[] = [
    { name: 'Default', value: 'default' },
    { name: 'Serif (Lora)', value: 'serif', className: 'font-serif' },
    { name: 'Mono', value: 'mono', className: 'font-mono' },
    { name: 'Roboto', value: 'roboto', className: 'font-roboto' },
    { name: 'Open Sans', value: 'open-sans', className: 'font-open-sans' },
    { name: 'Poppins', value: 'poppins', className: 'font-poppins' },
];

const colors: { name: string, value: ColorSetting, className: string }[] = [
    { name: 'Default', value: 'default', className: 'bg-primary' },
    { name: 'Blue', value: 'blue', className: 'bg-blue-600' },
    { name: 'Green', value: 'green', className: 'bg-green-600' },
    { name: 'Purple', value: 'purple', className: 'bg-purple-600' },
];

const textSizes: { name: string, value: TextSizeSetting }[] = [
    { name: 'Small', value: 'sm' },
    { name: 'Medium', value: 'base' },
    { name: 'Large', value: 'lg' },
    { name: 'Extra Large', value: 'xl' },
];

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onOpenChange }) => {
  const { font, color, textSize, setFont, setColor, setTextSize } = useAppearance();

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>
            Customize the appearance of the chat interface. Changes are saved automatically.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-8">
          {/* Typography Section */}
          <div className="space-y-4">
            <h3 className="font-medium text-lg">Typography</h3>
            <div className="space-y-2">
              <Label>Font Style</Label>
              <RadioGroup
                value={font}
                onValueChange={(value) => setFont(value as FontSetting)}
                className="grid grid-cols-2 gap-2 mt-2"
              >
                {fonts.map(f => (
                    <div key={f.value} className="flex items-center space-x-2">
                        <RadioGroupItem value={f.value} id={`font-${f.value}`} />
                        <Label htmlFor={`font-${f.value}`} className={cn("font-normal", f.className)}>{f.name}</Label>
                    </div>
                ))}
              </RadioGroup>
            </div>
            <div className="space-y-2">
              <Label>Text Size</Label>
              <RadioGroup
                value={textSize}
                onValueChange={(value) => setTextSize(value as TextSizeSetting)}
                className="flex items-center space-x-4 mt-2"
              >
                {textSizes.map(s => (
                     <div key={s.value} className="flex items-center space-x-2">
                        <RadioGroupItem value={s.value} id={`size-${s.value}`} />
                        <Label htmlFor={`size-${s.value}`} className="font-normal">{s.name}</Label>
                    </div>
                ))}
              </RadioGroup>
            </div>
          </div>

          {/* Appearance Section */}
          <div className="space-y-4">
            <h3 className="font-medium text-lg">Appearance</h3>
            <div className="space-y-2">
              <Label>Accent Color</Label>
              <div className="flex items-center space-x-2 mt-2">
                {colors.map(c => (
                    <button 
                        key={c.value} 
                        onClick={() => setColor(c.value)}
                        className={cn("h-8 w-8 rounded-full flex items-center justify-center transition-all", c.className, color === c.value && "ring-2 ring-offset-2 ring-ring ring-offset-background")}
                        aria-label={`Set theme color to ${c.name}`}
                    >
                        {color === c.value && <Check className="h-5 w-5 text-primary-foreground" />}
                    </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SettingsModal;
