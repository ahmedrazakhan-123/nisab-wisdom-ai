
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface SettingsModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

type FontSetting = 'default' | 'serif';

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onOpenChange }) => {
  const [font, setFont] = useState<FontSetting>('default');

  useEffect(() => {
    const savedFont = localStorage.getItem('app-font') as FontSetting | null;
    if (savedFont) {
      setFont(savedFont);
    }
  }, []);

  const handleFontChange = (newFont: FontSetting) => {
    setFont(newFont);
    localStorage.setItem('app-font', newFont);
    if (newFont === 'serif') {
      document.documentElement.classList.add('font-serif');
    } else {
      document.documentElement.classList.remove('font-serif');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>
            Customize the appearance of the application.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <div className="space-y-4">
            <h3 className="font-medium">Appearance</h3>
            <div className="space-y-2">
              <Label>Font Style</Label>
              <RadioGroup
                value={font}
                onValueChange={(value) => handleFontChange(value as FontSetting)}
                className="mt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="default" id="font-default" />
                  <Label htmlFor="font-default" className="font-normal">Default</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="serif" id="font-serif" />
                  <Label htmlFor="font-serif" className="font-serif font-normal">Serif (Lora)</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SettingsModal;
