import React, { useState, useEffect } from 'react';
import { useForm, UseFormReturn } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  Calculator, Wallet, CircleDollarSign, Briefcase, Home, 
  ArrowLeft, ArrowRight, RotateCcw, Download, AlertCircle,
  Heart, Info
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';

// Extend the jsPDF type
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

// --- Constants & Schema ---
const NISAB_GOLD_GRAMS = 87.48;
const NISAB_SILVER_GRAMS = 612.36;
const ZAKAT_RATE = 0.025;
const STORAGE_KEY_MUSAFFA = 'nisab_zakat_musaffa_style';

const selectionSchema = z.object({
  currency: z.string().default('USD'),
  selectedAssets: z.array(z.string()).default([]),
  selectedLiabilities: z.array(z.string()).default([])
});

const calculationSchema = z.object({
  currency: z.string().default('USD'),
  cashInHand: z.coerce.number().min(0).default(0),
  cashInBank: z.coerce.number().min(0).default(0),
  goldInGrams: z.coerce.number().min(0).default(0),
  silverInGrams: z.coerce.number().min(0).default(0),
  investments: z.coerce.number().min(0).default(0),
  businessAssets: z.coerce.number().min(0).default(0),
  propertyForTrading: z.coerce.number().min(0).default(0),
  loans: z.coerce.number().min(0).default(0),
  bills: z.coerce.number().min(0).default(0),
  wages: z.coerce.number().min(0).default(0),
  heldForOneYear: z.boolean().default(true)
});

type SelectionValues = z.infer<typeof selectionSchema>;
type CalculationValues = z.infer<typeof calculationSchema>;

const fmt = (n: number) => n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const num = (v: any) => { const n = parseFloat(v); return isNaN(n) ? 0 : n; };

const assetOptions = [
  { id: 'cash', label: 'Cash (In Hand / In Bank Account)', icon: Wallet },
  { id: 'gold_silver', label: 'Gold & Silver', icon: CircleDollarSign },
  { id: 'investments', label: 'Stock/Fund Investments', icon: Briefcase },
  { id: 'business', label: 'Business Assets', icon: Briefcase },
  { id: 'property', label: 'Property (For Trading)', icon: Home }
];

const liabilityOptions = [
  { id: 'loans', label: 'Loans', icon: CircleDollarSign },
  { id: 'bills', label: 'Immediate Bills / Taxes / Rent', icon: Wallet },
  { id: 'wages', label: 'Employee wages / Dealer payments', icon: Briefcase }
];

// --- Main Component ---
const ZakatCalculator: React.FC = () => {
  const { toast } = useToast();
  const [step, setStep] = useState<'selection' | 'calculation' | 'summary'>('selection');
  const [selectedAssets, setSelectedAssets] = useState<string[]>([]);
  const [selectedLiabilities, setSelectedLiabilities] = useState<string[]>([]);
  const [currency, setCurrency] = useState('USD');

  const calculationForm = useForm<CalculationValues>({
    resolver: zodResolver(calculationSchema),
    defaultValues: {
      currency: 'USD',
      cashInHand: 0,
      cashInBank: 0,
      goldInGrams: 0,
      silverInGrams: 0,
      investments: 0,
      businessAssets: 0,
      propertyForTrading: 0,
      loans: 0,
      bills: 0,
      wages: 0,
      heldForOneYear: true
    }
  });

  const [prices, setPrices] = useState({ gold: 75, silver: 0.95 });
  const [priceError, setPriceError] = useState<string | null>(null);

  // Fetch prices
  useEffect(() => {
    (async () => {
      try {
        const r = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=gold,silver&vs_currencies=usd');
        if (!r.ok) throw new Error('API request failed');
        const d = await r.json();
        const OZ = 31.1035;
        const g = d.gold?.usd ? d.gold.usd / OZ : null;
        const s = d.silver?.usd ? d.silver.usd / OZ : null;
        if (!g || !s) throw new Error('Invalid price data');
        setPrices({ gold: g, silver: s });
      } catch {
        setPriceError('Live price fetch failed. Using fallback values.');
      }
    })();
  }, []);

  const handleStart = () => {
    if (selectedAssets.length === 0) {
      toast({
        title: "Selection Required",
        description: "Please select at least one asset type to proceed.",
        variant: "destructive"
      });
      return;
    }
    calculationForm.setValue('currency', currency);
    setStep('calculation');
  };

  const handleCalculate = () => {
    setStep('summary');
  };

  const handleReset = () => {
    setStep('selection');
    setSelectedAssets([]);
    setSelectedLiabilities([]);
    setCurrency('USD');
    calculationForm.reset();
  };

  if (step === 'selection') {
    return <SelectionStep 
      currency={currency}
      setCurrency={setCurrency}
      selectedAssets={selectedAssets}
      setSelectedAssets={setSelectedAssets}
      selectedLiabilities={selectedLiabilities}
      setSelectedLiabilities={setSelectedLiabilities}
      onStart={handleStart}
    />;
  }

  if (step === 'calculation') {
    return <CalculationStep 
      form={calculationForm}
      selectedAssets={selectedAssets}
      selectedLiabilities={selectedLiabilities}
      onCalculate={handleCalculate}
      onBack={() => setStep('selection')}
    />;
  }

  return <SummaryStep 
    form={calculationForm}
    prices={prices}
    priceError={priceError}
    onReset={handleReset}
  />;
};

// --- Selection Step Component ---
interface SelectionStepProps {
  currency: string;
  setCurrency: (currency: string) => void;
  selectedAssets: string[];
  setSelectedAssets: React.Dispatch<React.SetStateAction<string[]>>;
  selectedLiabilities: string[];
  setSelectedLiabilities: React.Dispatch<React.SetStateAction<string[]>>;
  onStart: () => void;
}

const SelectionStep: React.FC<SelectionStepProps> = ({
  currency,
  setCurrency,
  selectedAssets,
  setSelectedAssets,
  selectedLiabilities,
  setSelectedLiabilities,
  onStart
}) => {
  const toggleAsset = (assetId: string) => {
    setSelectedAssets(prev => 
      prev.includes(assetId) 
        ? prev.filter(id => id !== assetId)
        : [...prev, assetId]
    );
  };

  const toggleLiability = (liabilityId: string) => {
    setSelectedLiabilities(prev => 
      prev.includes(liabilityId) 
        ? prev.filter(id => id !== liabilityId)
        : [...prev, liabilityId]
    );
  };

  return (
    <div className="w-full max-w-4xl mx-auto my-8 p-4 sm:p-6 lg:p-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-4 flex items-center justify-center gap-3">
          <Calculator /> Zakat Calculator
        </h1>
        <p className="text-muted-foreground">Select what you own and what you owe to calculate your Zakat</p>
      </div>

      <div className="flex justify-end mb-6">
        <Select value={currency} onValueChange={setCurrency}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Currency" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="USD">USD ($)</SelectItem>
            <SelectItem value="EUR">EUR (€)</SelectItem>
            <SelectItem value="GBP">GBP (£)</SelectItem>
            <SelectItem value="SAR">SAR (﷼)</SelectItem>
            <SelectItem value="AED">AED (د.إ)</SelectItem>
            <SelectItem value="PKR">PKR (Rs)</SelectItem>
            <SelectItem value="INR">INR (₹)</SelectItem>
            <SelectItem value="BDT">BDT (৳)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-8">
        {/* Assets Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Select what you own</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {assetOptions.map((asset) => (
              <div
                key={asset.id}
                className={cn(
                  "flex items-center space-x-3 p-3 rounded-lg border cursor-pointer transition-colors",
                  selectedAssets.includes(asset.id)
                    ? "border-primary bg-primary/5"
                    : "border-border hover:bg-muted/50"
                )}
                onClick={() => toggleAsset(asset.id)}
              >
                <Checkbox 
                  checked={selectedAssets.includes(asset.id)}
                  onChange={() => toggleAsset(asset.id)}
                  className="pointer-events-none"
                />
                <asset.icon className="h-5 w-5 text-muted-foreground" />
                <span className="flex-1 text-sm font-medium">{asset.label}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Liabilities Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Select your liabilities</CardTitle>
            <p className="text-sm text-muted-foreground">Optional - deductions from Zakat calculation</p>
          </CardHeader>
          <CardContent className="space-y-3">
            {liabilityOptions.map((liability) => (
              <div
                key={liability.id}
                className={cn(
                  "flex items-center space-x-3 p-3 rounded-lg border cursor-pointer transition-colors",
                  selectedLiabilities.includes(liability.id)
                    ? "border-primary bg-primary/5"
                    : "border-border hover:bg-muted/50"
                )}
                onClick={() => toggleLiability(liability.id)}
              >
                <Checkbox 
                  checked={selectedLiabilities.includes(liability.id)}
                  onChange={() => toggleLiability(liability.id)}
                  className="pointer-events-none"
                />
                <liability.icon className="h-5 w-5 text-muted-foreground" />
                <span className="flex-1 text-sm font-medium">{liability.label}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="text-center">
        <Button 
          onClick={onStart}
          size="lg"
          className="px-12 py-3 text-lg font-semibold"
          disabled={selectedAssets.length === 0}
        >
          START
        </Button>
      </div>
    </div>
  );
};

// --- Calculation Step Component ---
interface CalculationStepProps {
  form: UseFormReturn<CalculationValues>;
  selectedAssets: string[];
  selectedLiabilities: string[];
  onCalculate: () => void;
  onBack: () => void;
}

const CalculationStep: React.FC<CalculationStepProps> = ({
  form,
  selectedAssets,
  selectedLiabilities,
  onCalculate,
  onBack
}) => {
  const renderAssetFields = () => {
    const fields = [];

    if (selectedAssets.includes('cash')) {
      fields.push(
        <div key="cash" className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="cashInHand"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cash in Hand</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" min="0" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="cashInBank"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cash in Bank Account</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" min="0" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
      );
    }

    if (selectedAssets.includes('gold_silver')) {
      fields.push(
        <div key="gold_silver" className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="goldInGrams"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Gold (in grams)</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" min="0" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="silverInGrams"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Silver (in grams)</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" min="0" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
      );
    }

    if (selectedAssets.includes('investments')) {
      fields.push(
        <FormField
          key="investments"
          control={form.control}
          name="investments"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Stock/Fund Investments</FormLabel>
              <FormControl>
                <Input type="number" step="0.01" min="0" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
      );
    }

    if (selectedAssets.includes('business')) {
      fields.push(
        <FormField
          key="business"
          control={form.control}
          name="businessAssets"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Business Assets</FormLabel>
              <FormControl>
                <Input type="number" step="0.01" min="0" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
      );
    }

    if (selectedAssets.includes('property')) {
      fields.push(
        <FormField
          key="property"
          control={form.control}
          name="propertyForTrading"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Property (For Trading)</FormLabel>
              <FormControl>
                <Input type="number" step="0.01" min="0" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
      );
    }

    return fields;
  };

  const renderLiabilityFields = () => {
    const fields = [];

    if (selectedLiabilities.includes('loans')) {
      fields.push(
        <FormField
          key="loans"
          control={form.control}
          name="loans"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Loans</FormLabel>
              <FormControl>
                <Input type="number" step="0.01" min="0" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
      );
    }

    if (selectedLiabilities.includes('bills')) {
      fields.push(
        <FormField
          key="bills"
          control={form.control}
          name="bills"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Immediate Bills / Taxes / Rent</FormLabel>
              <FormControl>
                <Input type="number" step="0.01" min="0" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
      );
    }

    if (selectedLiabilities.includes('wages')) {
      fields.push(
        <FormField
          key="wages"
          control={form.control}
          name="wages"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Employee wages / Dealer payments</FormLabel>
              <FormControl>
                <Input type="number" step="0.01" min="0" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
      );
    }

    return fields;
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onCalculate)} className="w-full max-w-4xl mx-auto my-8 p-4 sm:p-6 lg:p-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-foreground mb-2">Enter Your Values</h2>
          <p className="text-muted-foreground">Please enter the monetary values for your selected items</p>
        </div>

        <div className="space-y-8">
          {/* Assets Section */}
          <Card>
            <CardHeader>
              <CardTitle>Your Assets</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {renderAssetFields()}
            </CardContent>
          </Card>

          {/* Liabilities Section */}
          {selectedLiabilities.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Your Liabilities</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {renderLiabilityFields()}
              </CardContent>
            </Card>
          )}

          {/* Duration Check */}
          <Card>
            <CardContent className="pt-6">
              <FormField
                control={form.control}
                name="heldForOneYear"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        I have held these assets for at least one lunar year (354 days)
                      </FormLabel>
                      <FormDescription>
                        Zakat is only due on assets held for a complete lunar year
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-between mt-8">
          <Button type="button" variant="outline" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" /> Back
          </Button>
          <Button type="submit">
            Calculate Zakat <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </form>
    </Form>
  );
};

// --- Summary Step Component ---
interface SummaryStepProps {
  form: UseFormReturn<CalculationValues>;
  prices: { gold: number; silver: number };
  priceError: string | null;
  onReset: () => void;
}

const SummaryStep: React.FC<SummaryStepProps> = ({
  form,
  prices,
  priceError,
  onReset
}) => {
  const values = form.getValues();
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  // Calculate totals
  const totalCash = num(values.cashInHand) + num(values.cashInBank);
  const goldValue = num(values.goldInGrams) * prices.gold;
  const silverValue = num(values.silverInGrams) * prices.silver;
  const totalAssets = totalCash + goldValue + silverValue + 
    num(values.investments) + num(values.businessAssets) + num(values.propertyForTrading);
  
  const totalLiabilities = num(values.loans) + num(values.bills) + num(values.wages);
  const netWealth = Math.max(0, totalAssets - totalLiabilities);
  
  // Calculate Nisab thresholds
  const goldNisab = NISAB_GOLD_GRAMS * prices.gold;
  const silverNisab = NISAB_SILVER_GRAMS * prices.silver;
  const nisabThreshold = Math.min(goldNisab, silverNisab);
  
  const meetsNisab = netWealth >= nisabThreshold && values.heldForOneYear;
  const zakatDue = meetsNisab ? netWealth * ZAKAT_RATE : 0;

  const generatePDF = async () => {
    setIsGeneratingPDF(true);
    try {
      const { jsPDF } = await import('jspdf');
      await import('jspdf-autotable');
      
      const doc = new jsPDF();
      const date = new Date().toLocaleDateString();
      
      // Header
      doc.setFontSize(20);
      doc.text('Zakat Calculation Report', 105, 20, { align: 'center' });
      doc.setFontSize(12);
      doc.text(`Generated on: ${date}`, 105, 30, { align: 'center' });
      
      // Summary
      doc.setFontSize(14);
      doc.text('Summary', 20, 50);
      doc.setFontSize(10);
      doc.text(`Total Assets: ${values.currency} ${fmt(totalAssets)}`, 20, 60);
      doc.text(`Total Liabilities: ${values.currency} ${fmt(totalLiabilities)}`, 20, 70);
      doc.text(`Net Wealth: ${values.currency} ${fmt(netWealth)}`, 20, 80);
      doc.text(`Nisab Threshold: ${values.currency} ${fmt(nisabThreshold)}`, 20, 90);
      doc.text(`Zakat Due: ${values.currency} ${fmt(zakatDue)}`, 20, 100);
      
      // Assets breakdown
      if (totalAssets > 0) {
        const assetData = [
          ['Cash in Hand', values.currency, fmt(values.cashInHand)],
          ['Cash in Bank', values.currency, fmt(values.cashInBank)],
          ['Gold (' + values.goldInGrams + 'g)', values.currency, fmt(goldValue)],
          ['Silver (' + values.silverInGrams + 'g)', values.currency, fmt(silverValue)],
          ['Investments', values.currency, fmt(values.investments)],
          ['Business Assets', values.currency, fmt(values.businessAssets)],
          ['Property for Trading', values.currency, fmt(values.propertyForTrading)]
        ];
        
        doc.autoTable({
          head: [['Asset Type', 'Currency', 'Value']],
          body: assetData.filter(row => parseFloat(row[2].replace(/,/g, '')) > 0),
          startY: 120,
          theme: 'striped'
        });
      }
      
      doc.save('zakat-calculation.pdf');
    } catch (error) {
      console.error('PDF generation failed:', error);
      alert('Failed to generate PDF report');
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto my-8 p-4 sm:p-6 lg:p-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-foreground mb-2">Zakat Calculation Summary</h2>
        <p className="text-muted-foreground">Your complete Zakat calculation results</p>
      </div>

      {priceError && (
        <Alert className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Price Warning</AlertTitle>
          <AlertDescription>{priceError}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Assets Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Assets Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              {totalCash > 0 && <div className="flex justify-between"><span>Cash:</span><span>{values.currency} {fmt(totalCash)}</span></div>}
              {goldValue > 0 && <div className="flex justify-between"><span>Gold ({values.goldInGrams}g):</span><span>{values.currency} {fmt(goldValue)}</span></div>}
              {silverValue > 0 && <div className="flex justify-between"><span>Silver ({values.silverInGrams}g):</span><span>{values.currency} {fmt(silverValue)}</span></div>}
              {values.investments > 0 && <div className="flex justify-between"><span>Investments:</span><span>{values.currency} {fmt(values.investments)}</span></div>}
              {values.businessAssets > 0 && <div className="flex justify-between"><span>Business Assets:</span><span>{values.currency} {fmt(values.businessAssets)}</span></div>}
              {values.propertyForTrading > 0 && <div className="flex justify-between"><span>Property:</span><span>{values.currency} {fmt(values.propertyForTrading)}</span></div>}
              <Separator />
              <div className="flex justify-between font-semibold">
                <span>Total Assets:</span>
                <span>{values.currency} {fmt(totalAssets)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Liabilities & Net Wealth */}
        <Card>
          <CardHeader>
            <CardTitle>Net Wealth Calculation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Total Assets:</span>
                <span>{values.currency} {fmt(totalAssets)}</span>
              </div>
              {totalLiabilities > 0 && (
                <>
                  <div className="flex justify-between text-red-600">
                    <span>Total Liabilities:</span>
                    <span>-{values.currency} {fmt(totalLiabilities)}</span>
                  </div>
                  <Separator />
                </>
              )}
              <div className="flex justify-between font-semibold text-lg">
                <span>Net Wealth:</span>
                <span>{values.currency} {fmt(netWealth)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Zakat Calculation Result */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Zakat Calculation Result
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-sm text-muted-foreground">Nisab Threshold</p>
                <p className="text-lg font-semibold">{values.currency} {fmt(nisabThreshold)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Your Net Wealth</p>
                <p className="text-lg font-semibold">{values.currency} {fmt(netWealth)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Zakat Due (2.5%)</p>
                <p className={`text-2xl font-bold ${meetsNisab ? 'text-green-600' : 'text-orange-600'}`}>
                  {values.currency} {fmt(zakatDue)}
                </p>
              </div>
            </div>

            <Alert className={meetsNisab ? "border-green-500" : "border-orange-500"}>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>
                {meetsNisab ? "Zakat is Due" : "Zakat is Not Due"}
              </AlertTitle>
              <AlertDescription>
                {meetsNisab 
                  ? `Your net wealth exceeds the Nisab threshold and you've held assets for a full lunar year. You must pay ${values.currency} ${fmt(zakatDue)} in Zakat.`
                  : netWealth < nisabThreshold 
                    ? "Your net wealth is below the Nisab threshold, so no Zakat is due."
                    : "You haven't held assets for a complete lunar year, so no Zakat is due yet."
                }
              </AlertDescription>
            </Alert>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button onClick={onReset} variant="outline">
          <RotateCcw className="h-4 w-4 mr-2" />
          Calculate Again
        </Button>
        <Button onClick={generatePDF} disabled={isGeneratingPDF}>
          {isGeneratingPDF ? (
            <>
              <div className="animate-spin h-4 w-4 mr-2 border-2 border-current border-t-transparent rounded-full" />
              Generating...
            </>
          ) : (
            <>
              <Download className="h-4 w-4 mr-2" />
              Download PDF Report
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default ZakatCalculator;