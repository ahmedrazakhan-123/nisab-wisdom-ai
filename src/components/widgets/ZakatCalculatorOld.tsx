// Musaffa-Style Zakat Calculator
import React, { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { Calculator, Info, Download, ClipboardCopy, Wallet, Landmark, Briefcase, Home, CircleDollarSign } from 'lucide-react';
import { cn } from '@/lib/utils';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

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
  setSelectedAssets: (assets: string[]) => void;
  selectedLiabilities: string[];
  setSelectedLiabilities: (liabilities: string[]) => void;
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
};

// --- Step Components ---

const AssetsStep = () => {
  const { control } = useFormContext<FormValues>();
  return (
    <div className="space-y-6">
      <FormSectionCard title="Cash & Equivalents">
        <FormField control={control} name="cashInHand" render={({ field }) => <FormInput icon={Wallet} label="Cash in Hand" field={field} />} />
        <FormField control={control} name="cashInBank" render={({ field }) => <FormInput icon={Landmark} label="Bank Balances" field={field} />} />
      </FormSectionCard>
      <FormSectionCard title="Precious Metals">
        <FormField control={control} name="goldInGrams" render={({ field }) => <FormInput icon={Wallet} label="Gold (grams)" field={field} type="number" />} />
        <FormField control={control} name="silverInGrams" render={({ field }) => <FormInput icon={Wallet} label="Silver (grams)" field={field} type="number" />} />
      </FormSectionCard>
      <FormSectionCard title="Investments & Business">
        <FormField control={control} name="crypto" render={({ field }) => <FormInput icon={CircleDollarSign} label="Crypto Holdings" field={field} tooltip="The value of cryptocurrencies like Bitcoin, Ethereum, etc." />} />
        <FormField control={control} name="investments" render={({ field }) => <FormInput icon={TrendingUp} label="Stocks & Funds" field={field} tooltip="The market value of your stocks, mutual funds, and other investment instruments." />} />
        <FormField control={control} name="receivables" render={({ field }) => <FormInput icon={Briefcase} label="Accounts Receivable" field={field} tooltip="Money owed to you from business transactions that you expect to receive." />} />
        <FormField control={control} name="businessAssets" render={({ field }) => <FormInput icon={Briefcase} label="Business Inventory" field={field} tooltip="The value of inventory and goods intended for sale." />} />
        <FormField control={control} name="propertyForTrading" render={({ field }) => <FormInput icon={Home} label="Property (for Trading)" field={field} tooltip="Value of real estate purchased with the intention to resell for profit." />} />
      </FormSectionCard>
    </div>
  );
};

const LiabilitiesStep = () => {
  const { control } = useFormContext<FormValues>();
  return (
    <div className="space-y-6">
      <FormSectionCard title="Debts & Payables">
        <FormField control={control} name="liabilitiesLoans" render={({ field }) => <FormInput icon={CircleDollarSign} label="Loans (due this year)" field={field} />} />
        <FormField control={control} name="creditCardDebt" render={({ field }) => <FormInput icon={Wallet} label="Credit Card Debt" field={field} />} />
        <FormField control={control} name="liabilitiesBills" render={({ field }) => <FormInput icon={Briefcase} label="Bills, Taxes, Rent" field={field} />} />
        <FormField control={control} name="liabilitiesWages" render={({ field }) => <FormInput icon={Wallet} label="Employee / Dealer Payables" field={field} />} />
      </FormSectionCard>
    </div>
  );
};

// --- Enhanced BreakdownChart ---
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const COLORS = [
  '#14b8a6', '#6366f1', '#f59e42', '#ef4444', '#10b981', '#f43f5e', '#eab308', '#3b82f6', '#a21caf', '#64748b'
];

const BreakdownChart: React.FC<{ title: string, data: { name: string, value: number }[], sym: string }> = ({ title, data, sym }) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  return (
    <Card>
      <CardHeader><CardTitle>{title}</CardTitle></CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row gap-6 items-center">
          <div className="w-full md:w-1/2 h-64">
            <ResponsiveContainer>
              <RechartsPieChart>
                <RechartsTooltip formatter={(value, name, props) => `${sym}${fmt(value as number)}`} />
                <Pie
                  data={data.length > 0 ? data : [{ name: 'N/A', value: 1 }]}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={data.length > 1 ? 5 : 0}
                  label={false}
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                  {data.length === 0 && <Cell fill="#e5e7eb" />}
                </Pie>
              </RechartsPieChart>
            </ResponsiveContainer>
          </div>
          <div className="w-full md:w-1/2">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item</TableHead>
                  <TableHead>Value</TableHead>
                  <TableHead>%</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((item, idx) => (
                  <TableRow key={item.name}>
                    <TableCell className="flex items-center gap-2">
                      <span style={{ background: COLORS[idx % COLORS.length], width: 12, height: 12, borderRadius: '50%', display: 'inline-block' }} />
                      {item.name}
                    </TableCell>
                    <TableCell>{sym}{fmt(item.value)}</TableCell>
                    <TableCell>{total > 0 ? ((item.value / total) * 100).toFixed(1) : '0.0'}%</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const SummaryStep: React.FC<{ prices: { gold: number, silver: number }, priceError: string | null }> = ({ prices, priceError }) => {
  const { watch, control } = useFormContext<FormValues>();
  const w = watch();
  
  const sym = ({USD:'$',EUR:'€',GBP:'£',SAR:'﷼',AED:'د.إ',PKR:'Rs',INR:'₹',BDT:'৳'} as Record<string,string>)[w.currency] || '$';
  const goldValue = useMemo(()=> num(w.goldInGrams) * prices.gold, [w.goldInGrams, prices.gold]);
  const silverValue = useMemo(()=> num(w.silverInGrams) * prices.silver, [w.silverInGrams, prices.silver]);
  
  const assetBreakdown = useMemo(() => [
    { name: 'Cash', value: num(w.cashInHand) + num(w.cashInBank) },
    { name: 'Crypto', value: num(w.crypto) },
    { name: 'Receivables', value: num(w.receivables) },
    { name: 'Gold', value: goldValue },
    { name: 'Silver', value: silverValue },
    { name: 'Investments', value: num(w.investments) },
    { name: 'Business Assets', value: num(w.businessAssets) + num(w.propertyForTrading) },
  ].filter(item => item.value > 0), [w, goldValue, silverValue]);

  const liabilityBreakdown = useMemo(() => [
    { name: 'Loans & Debts', value: num(w.liabilitiesLoans) + num(w.creditCardDebt) },
    { name: 'Bills & Payables', value: num(w.liabilitiesBills) + num(w.liabilitiesWages) },
  ].filter(item => item.value > 0), [w]);

  const assets = useMemo(() => assetBreakdown.reduce((sum, item) => sum + item.value, 0), [assetBreakdown]);
  const liabilities = useMemo(() => liabilityBreakdown.reduce((sum, item) => sum + item.value, 0), [liabilityBreakdown]);
  const net = Math.max(0, assets - liabilities);
  
  const nisab = useMemo(()=>{
    if(!prices.gold || !prices.silver) return Number.MAX_SAFE_INTEGER;
    const gVal = NISAB_GOLD_GRAMS * prices.gold;
    const sVal = NISAB_SILVER_GRAMS * prices.silver;
    return Math.min(gVal, sVal);
  },[prices]);

  const applicable = net >= nisab && w.heldForOneYear;
  const zakatDue = applicable ? net * ZAKAT_RATE : 0;

  const handleDownloadPdf = () => {
    const doc = new jsPDF();
    const today = new Date().toLocaleDateString();
    const fileName = `Zakat_Calculation_${today}.pdf`;
    doc.setFontSize(22);
    doc.text("Zakat Calculation Summary", 14, 22);
    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text(`Report generated on: ${today}`, 14, 28);
    doc.setFontSize(12);
    doc.setTextColor(0);
    doc.text("Financial Snapshot", 14, 40);
    const summaryData = [
        ["Total Assets", `${sym}${fmt(assets)}`],
        ["Total Liabilities", `-${sym}${fmt(liabilities)}`],
        ["Net Zakatable Wealth", `${sym}${fmt(net)}`],
        ["Nisab Threshold", `${sym}${fmt(nisab)}`],
        ["Zakat Due", `${sym}${fmt(zakatDue)}`],
    ];
    doc.autoTable({ startY: 45, head: [['Metric', 'Value']], body: summaryData, theme: 'striped', headStyles: { fillColor: [15, 118, 110] } });
    let finalY = (doc as any).lastAutoTable.finalY || 80;
    if (assetBreakdown.length > 0) {
        doc.text("Asset Breakdown", 14, finalY + 10);
        doc.autoTable({ startY: finalY + 15, head: [['Asset', 'Value']], body: assetBreakdown.map(a => [a.name, `${sym}${fmt(a.value)}`]), theme: 'striped', headStyles: { fillColor: [15, 118, 110] } });
        finalY = (doc as any).lastAutoTable.finalY;
    }
    if (liabilityBreakdown.length > 0) {
        doc.text("Liability Breakdown", 14, finalY + 10);
        doc.autoTable({ startY: finalY + 15, head: [['Liability', 'Value']], body: liabilityBreakdown.map(l => [l.name, `${sym}${fmt(l.value)}`]), theme: 'striped', headStyles: { fillColor: [15, 118, 110] } });
        finalY = (doc as any).lastAutoTable.finalY;
    }
    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text("Disclaimer: This is a simplified model. For complex financial situations, please consult a qualified Islamic scholar.", 14, finalY + 15);
    doc.save(fileName);
  };

  const handleCopySummary = () => {
    const summaryText = `
Zakat Calculation Summary
-----------------------------
Total Assets: ${sym}${fmt(assets)}
Total Liabilities: -${sym}${fmt(liabilities)}
Net Zakatable Wealth: ${sym}${fmt(net)}
Nisab Threshold: ${sym}${fmt(nisab)}
Zakat Due: ${sym}${fmt(zakatDue)}
-----------------------------
Asset Breakdown:
${assetBreakdown.map(a => `- ${a.name}: ${sym}${fmt(a.value)}`).join('\n')}
-----------------------------
Liability Breakdown:
${liabilityBreakdown.map(l => `- ${l.name}: ${sym}${fmt(l.value)}`).join('\n')}
    `;
    navigator.clipboard.writeText(summaryText.trim())
      .then(() => alert('Summary copied to clipboard!'))
      .catch(() => alert('Failed to copy summary.'));
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <BreakdownChart title="Asset Breakdown" data={assetBreakdown} sym={sym} />
        <BreakdownChart title="Liability Breakdown" data={liabilityBreakdown} sym={sym} />
      </div>
      <div className="space-y-6">
        <Card className="shadow-lg">
          <CardHeader className="text-center bg-brand-teal/10 p-6">
            <CardDescription className="text-brand-teal font-semibold">Total Zakat Due</CardDescription>
            <CardTitle className="text-5xl font-bold text-brand-teal tracking-tight">{sym}{fmt(zakatDue)}</CardTitle>
            {!applicable && (
              <p className="text-xs mt-1 text-brand-teal/80">
                {w.heldForOneYear ? 'Your wealth is below the Nisab threshold.' : 'Wealth not held for one lunar year.'}
              </p>
            )}
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Total Assets</span><span className="font-medium">{sym}{fmt(assets)}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Total Liabilities</span><span className="font-medium">-{sym}${fmt(liabilities)}</span></div>
              <Separator className="my-2" />
              <div className="flex justify-between text-base"><span className="font-semibold">Net Zakatable Wealth</span><span className="font-semibold">{sym}${fmt(net)}</span></div>
              <div className="flex justify-between text-xs"><span className="text-muted-foreground">Nisab Threshold</span><span className="font-medium">{sym}${fmt(nisab)}</span></div>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleCopySummary} variant="outline" className="w-full"><ClipboardCopy className="h-4 w-4 mr-2"/>Copy</Button>
              <Button onClick={handleDownloadPdf} variant="outline" className="w-full"><Download className="h-4 w-4 mr-2"/>PDF</Button>
            </div>
          </CardContent>
        </Card>
        <FormField
          control={control}
          name="heldForOneYear"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start gap-4 rounded-lg border p-4 shadow-sm bg-muted/30">
              <FormControl>
                <Checkbox checked={!!field.value} onCheckedChange={(c) => field.onChange(c === true)} />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Wealth held for one lunar year (Haul)</FormLabel>
                <p className="text-xs text-muted-foreground">Zakat generally applies after a full Hijri year passes on wealth above Nisab.</p>
              </div>
            </FormItem>
          )}
        />
      </div>
      <ZakatDistributionGuide />
    </div>
  );
};

const ZakatDistributionGuide = () => (
  <Card>
    <CardHeader>
      <CardTitle>Understanding Zakat Distribution</CardTitle>
      <CardDescription>
        Based on the Quran (Surah At-Tawbah, 9:60), Zakat is distributed among eight categories of people.
      </CardDescription>
    </CardHeader>
    <CardContent>
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="item-1">
          <AccordionTrigger>1. The Poor (Al-Fuqara)</AccordionTrigger>
          <AccordionContent>
            Those who live without means of livelihood.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>2. The Needy (Al-Masakin)</AccordionTrigger>
          <AccordionContent>
            Those without sufficient means of livelihood to meet their basic needs.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3">
          <AccordionTrigger>3. Zakat Collectors (Al-Amilin 'Alayha)</AccordionTrigger>
          <AccordionContent>
            The administrators and collectors of Zakat.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-4">
          <AccordionTrigger>4. To Reconcile Hearts (Al-Mu'allafati Qulubuhum)</AccordionTrigger>
          <AccordionContent>
            New Muslims and friends of the Muslim community who are in need of support.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-5">
          <AccordionTrigger>5. To Free Captives (Fi al-Riqab)</AccordionTrigger>
          <AccordionContent>
            For freeing slaves or captives.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-6">
          <AccordionTrigger>6. The Debt-Ridden (Al-Gharimin)</AccordionTrigger>
          <AccordionContent>
            Those who are in overwhelming debt.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-7">
          <AccordionTrigger>7. In the Cause of Allah (Fi Sabilillah)</AccordionTrigger>
          <AccordionContent>
            For those struggling for a righteous cause in the path of Allah, e.g., students of knowledge, community projects.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-8">
          <AccordionTrigger>8. The Wayfarer (Ibn al-Sabil)</AccordionTrigger>
          <AccordionContent>
            Travelers who are stranded and in need of financial assistance.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </CardContent>
  </Card>
);


// --- Sub-components ---

const FormSectionCard: React.FC<{title: string, children: React.ReactNode}> = ({ title, children }) => (
    <Card className="bg-muted/20 border-border/30">
        <CardHeader>
            <CardTitle className="text-lg">{title}</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {children}
        </CardContent>
    </Card>
);

const FormInput: React.FC<{icon: React.ElementType, label: string, field: any, type?: string, tooltip?: string}> = ({ icon: Icon, label, field, type = "number", tooltip }) => (
    <FormItem>
        <FormLabel className="flex items-center gap-1.5">
            {label}
            {tooltip && (
                <Tooltip>
                    <TooltipTrigger asChild>
                        <button type="button" className="p-0.5" onClick={(e) => e.preventDefault()}>
                            <Info className="h-3 w-3 text-muted-foreground" />
                        </button>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p className="max-w-xs">{tooltip}</p>
                    </TooltipContent>
                </Tooltip>
            )}
        </FormLabel>
        <div className="relative">
            <Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <FormControl>
                <Input type={type} inputMode={type === "number" ? "decimal" : "text"} placeholder="0.00" className="pl-9" {...field} onChange={e => field.onChange(e.target.value === '' ? 0 : e.target.value)} />
            </FormControl>
        </div>
        <FormMessage />
    </FormItem>
);

export default ZakatCalculator;