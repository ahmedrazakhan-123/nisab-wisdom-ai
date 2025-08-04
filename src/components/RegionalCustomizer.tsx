import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Globe, MapPin, ChevronDown } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';

interface RegionalSettings {
  region: string;
  country: string;
  currency: string;
  madhab: string;
  language: string;
  flag: string;
}

const regions: RegionalSettings[] = [
  { region: 'Middle East', country: 'UAE', currency: 'AED', madhab: 'Hanbali', language: 'Arabic', flag: '🇦🇪' },
  { region: 'Middle East', country: 'Saudi Arabia', currency: 'SAR', madhab: 'Hanbali', language: 'Arabic', flag: '🇸🇦' },
  { region: 'Southeast Asia', country: 'Malaysia', currency: 'MYR', madhab: 'Shafi', language: 'Malay', flag: '🇲🇾' },
  { region: 'Southeast Asia', country: 'Indonesia', currency: 'IDR', madhab: 'Shafi', language: 'Indonesian', flag: '🇮🇩' },
  { region: 'South Asia', country: 'Pakistan', currency: 'PKR', madhab: 'Hanafi', language: 'Urdu', flag: '🇵🇰' },
  { region: 'North America', country: 'USA', currency: 'USD', madhab: 'Mixed', language: 'English', flag: '🇺🇸' },
  { region: 'Europe', country: 'UK', currency: 'GBP', madhab: 'Mixed', language: 'English', flag: '🇬🇧' },
  { region: 'Africa', country: 'Nigeria', currency: 'NGN', madhab: 'Maliki', language: 'English', flag: '🇳🇬' }
];

interface RegionalCustomizerProps {
  onRegionChange: (settings: RegionalSettings) => void;
  currentSettings?: RegionalSettings;
}

export default function RegionalCustomizer({ onRegionChange, currentSettings }: RegionalCustomizerProps) {
  const [selectedRegion, setSelectedRegion] = useState<RegionalSettings>(
    currentSettings || regions[0]
  );
  const [isOpen, setIsOpen] = useState(false);
  const [autoDetected, setAutoDetected] = useState<RegionalSettings | null>(null);

  useEffect(() => {
    // Auto-detect user's region based on IP/locale
    const detectRegion = async () => {
      try {
        // Simple locale-based detection
        const locale = navigator.language || 'en-US';
        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        
        let detected = regions[0]; // Default to UAE
        
        if (locale.startsWith('ar')) {
          detected = regions.find(r => r.country === 'Saudi Arabia') || regions[0];
        } else if (locale.startsWith('ms') || timezone.includes('Kuala_Lumpur')) {
          detected = regions.find(r => r.country === 'Malaysia') || regions[0];
        } else if (locale.startsWith('id') || timezone.includes('Jakarta')) {
          detected = regions.find(r => r.country === 'Indonesia') || regions[0];
        } else if (locale.startsWith('ur') || timezone.includes('Karachi')) {
          detected = regions.find(r => r.country === 'Pakistan') || regions[0];
        } else if (timezone.includes('New_York') || timezone.includes('Chicago')) {
          detected = regions.find(r => r.country === 'USA') || regions[0];
        } else if (timezone.includes('London')) {
          detected = regions.find(r => r.country === 'UK') || regions[0];
        }
        
        setAutoDetected(detected);
        if (!currentSettings) {
          setSelectedRegion(detected);
          onRegionChange(detected);
        }
      } catch (error) {
        console.log('Could not auto-detect region');
      }
    };

    detectRegion();
  }, [currentSettings, onRegionChange]);

  const handleRegionSelect = (region: RegionalSettings) => {
    setSelectedRegion(region);
    onRegionChange(region);
    setIsOpen(false);
  };

  const groupedRegions = regions.reduce((acc, region) => {
    if (!acc[region.region]) {
      acc[region.region] = [];
    }
    acc[region.region].push(region);
    return acc;
  }, {} as Record<string, RegionalSettings[]>);

  return (
    <div className="w-full">
      <div className="flex items-center gap-2 mb-4">
        <Globe className="h-5 w-5 text-brand-teal" />
        <h3 className="font-medium text-foreground">Regional Settings</h3>
        {autoDetected && (
          <Badge variant="outline" className="text-xs">
            <MapPin className="h-3 w-3 mr-1" />
            Auto-detected
          </Badge>
        )}
      </div>

      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-full justify-between">
            <div className="flex items-center gap-2">
              <span className="text-lg">{selectedRegion.flag}</span>
              <span className="font-medium">{selectedRegion.country}</span>
              <Badge variant="secondary" className="text-xs">
                {selectedRegion.madhab}
              </Badge>
            </div>
            <ChevronDown className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        
        <PopoverContent className="w-80 p-4">
          <div className="space-y-4">
            {Object.entries(groupedRegions).map(([regionName, countries]) => (
              <div key={regionName}>
                <h4 className="font-medium text-sm text-muted-foreground mb-2">
                  {regionName}
                </h4>
                <div className="space-y-2">
                  {countries.map((country) => (
                    <button
                      key={country.country}
                      onClick={() => handleRegionSelect(country)}
                      className="w-full p-3 text-left rounded-lg border hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-lg">{country.flag}</span>
                          <div>
                            <div className="font-medium text-sm">{country.country}</div>
                            <div className="text-xs text-muted-foreground">
                              {country.currency} • {country.language}
                            </div>
                          </div>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {country.madhab}
                        </Badge>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </PopoverContent>
      </Popover>

      <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
        <div>
          <span className="text-muted-foreground">Currency:</span>
          <span className="ml-2 font-medium text-foreground">{selectedRegion.currency}</span>
        </div>
        <div>
          <span className="text-muted-foreground">Madhab:</span>
          <span className="ml-2 font-medium text-foreground">{selectedRegion.madhab}</span>
        </div>
        <div>
          <span className="text-muted-foreground">Language:</span>
          <span className="ml-2 font-medium text-foreground">{selectedRegion.language}</span>
        </div>
        <div>
          <span className="text-muted-foreground">Region:</span>
          <span className="ml-2 font-medium text-foreground">{selectedRegion.region}</span>
        </div>
      </div>
    </div>
  );
}