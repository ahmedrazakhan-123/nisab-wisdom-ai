import React, { useState, useEffect } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  Calculator, Wallet, CircleDollarSign, Briefcase, Home, 
  Download, AlertCircle, TrendingUp, Landmark, RotateCcw
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
import { Progress } from '@/components/ui/progress';

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

const schema = z.object({
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

type FormValues = z.infer<typeof schema>;

const fmt = (n: number) => n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const num = (v: any) => { const n = parseFloat(v); return isNaN(n) ? 0 : n; };

const currencySymbols = {
  USD: '$', EUR: '€', GBP: '£', SAR: '﷼', AED: 'د.إ', 
  PKR: 'Rs', INR: '₹', BDT: '৳'
};

// --- Main Component ---
const ZakatCalculator: React.FC = () => {
  const { toast } = useToast();
  const [prices, setPrices] = useState({ gold: 75, silver: 0.95 });
  const [priceError, setPriceError] = useState<string | null>(null);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
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
    },
    mode: 'onChange'
  });

  const watchedValues = useWatch({ control: form.control });
  
  // Calculate totals for live display
  const totalCash = num(watchedValues.cashInHand) + num(watchedValues.cashInBank);
  const goldValue = num(watchedValues.goldInGrams) * prices.gold;
  const silverValue = num(watchedValues.silverInGrams) * prices.silver;
  const totalAssets = totalCash + goldValue + silverValue + 
    num(watchedValues.investments) + num(watchedValues.businessAssets) + num(watchedValues.propertyForTrading);
  
  const totalLiabilities = num(watchedValues.loans) + num(watchedValues.bills) + num(watchedValues.wages);
  const netWealth = Math.max(0, totalAssets - totalLiabilities);
  
  // Calculate Nisab thresholds
  const goldNisab = NISAB_GOLD_GRAMS * prices.gold;
  const silverNisab = NISAB_SILVER_GRAMS * prices.silver;
  const nisabThreshold = Math.min(goldNisab, silverNisab);
  
  const nisabProgress = Math.min((netWealth / nisabThreshold) * 100, 100);
  const meetsNisab = netWealth >= nisabThreshold && watchedValues.heldForOneYear;
  const zakatDue = meetsNisab ? netWealth * ZAKAT_RATE : 0;

  const symbol = currencySymbols[watchedValues.currency as keyof typeof currencySymbols] || watchedValues.currency;

  // Fetch live prices
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
        setPriceError(null);
      } catch {
        setPriceError('Using fallback prices - live data unavailable');
      }
    })();
  }, []);

  const generatePDF = async () => {
    setIsGeneratingPDF(true);
    try {
      const { jsPDF } = await import('jspdf');
      await import('jspdf-autotable');
      
      const values = form.getValues();
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
      
      doc.save('zakat-calculation.pdf');
      
      toast({
        title: "PDF Generated",
        description: "Your Zakat calculation report has been downloaded.",
      });
    } catch (error) {
      console.error('PDF generation failed:', error);
      toast({
        title: "PDF Generation Failed",
        description: "Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const resetForm = () => {
    form.reset();
    toast({
      title: "Form Reset",
      description: "All values have been cleared.",
    });
  };

  return (
    <Form {...form}>
      <div className="min-h-screen bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-4 sm:space-y-6">
          {/* Header */}
          <Card className="shadow-sm">
            <CardHeader className="pb-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-3">
                  <Calculator className="h-6 w-6 sm:h-8 sm:w-8 text-primary flex-shrink-0" />
                  <div className="min-w-0">
                    <CardTitle className="text-xl sm:text-2xl">Zakat Calculator</CardTitle>
                    <p className="text-sm text-muted-foreground hidden sm:block">Calculate your Islamic obligation with confidence</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                  <FormField
                    control={form.control}
                    name="currency"
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger className="w-[100px] sm:w-[120px]">
                          <SelectValue />
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
                    )}
                  />
                  
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm"
                    onClick={resetForm}
                    className="hidden sm:flex"
                  >
                    <RotateCcw className="h-4 w-4 mr-1" />
                    Reset
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm"
                    onClick={resetForm}
                    className="sm:hidden"
                  >
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                  
                  <Button 
                    type="button" 
                    size="sm"
                    onClick={generatePDF}
                    disabled={isGeneratingPDF}
                    className="hidden sm:flex"
                  >
                    {isGeneratingPDF ? (
                      <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full mr-1" />
                    ) : (
                      <Download className="h-4 w-4 mr-1" />
                    )}
                    PDF
                  </Button>
                  <Button 
                    type="button" 
                    size="sm"
                    onClick={generatePDF}
                    disabled={isGeneratingPDF}
                    className="sm:hidden"
                  >
                    {isGeneratingPDF ? (
                      <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                    ) : (
                      <Download className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            </CardHeader>
          </Card>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6">
            {/* Main Form */}
            <div className="xl:col-span-2 space-y-4 sm:space-y-6 order-2 xl:order-1">
              {/* Assets Section */}
              <Card className="shadow-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Wallet className="h-5 w-5 flex-shrink-0" />
                    Assets & Wealth
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 sm:space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="cashInHand"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2 text-sm font-medium">
                            <Wallet className="h-4 w-4 flex-shrink-0" />
                            Cash in Hand
                          </FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                type="number"
                                step="0.01"
                                min="0"
                                placeholder="0.00"
                                {...field}
                                className="pl-8 h-11 text-base"
                                inputMode="decimal"
                              />
                              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm font-medium">
                                {symbol}
                              </div>
                            </div>
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="cashInBank"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2 text-sm font-medium">
                            <Landmark className="h-4 w-4 flex-shrink-0" />
                            Bank Account Balance
                          </FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                type="number"
                                step="0.01"
                                min="0"
                                placeholder="0.00"
                                {...field}
                                className="pl-8 h-11 text-base"
                                inputMode="decimal"
                              />
                              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm font-medium">
                                {symbol}
                              </div>
                            </div>
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>

                  <Separator className="my-4 sm:my-6" />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="goldInGrams"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2 text-sm font-medium">
                            <CircleDollarSign className="h-4 w-4 text-yellow-500 flex-shrink-0" />
                            <span className="flex-1">Gold (grams)</span>
                            <span className="text-xs text-muted-foreground whitespace-nowrap">
                              ${prices.gold.toFixed(2)}/g
                            </span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              step="0.01"
                              min="0"
                              placeholder="0.00"
                              {...field}
                              className="h-11 text-base"
                              inputMode="decimal"
                            />
                          </FormControl>
                          {field.value > 0 && (
                            <p className="text-sm text-muted-foreground">
                              Value: {symbol}{fmt(field.value * prices.gold)}
                            </p>
                          )}
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="silverInGrams"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2 text-sm font-medium">
                            <CircleDollarSign className="h-4 w-4 text-gray-400 flex-shrink-0" />
                            <span className="flex-1">Silver (grams)</span>
                            <span className="text-xs text-muted-foreground whitespace-nowrap">
                              ${prices.silver.toFixed(2)}/g
                            </span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              step="0.01"
                              min="0"
                              placeholder="0.00"
                              {...field}
                              className="h-11 text-base"
                              inputMode="decimal"
                            />
                          </FormControl>
                          {field.value > 0 && (
                            <p className="text-sm text-muted-foreground">
                              Value: {symbol}{fmt(field.value * prices.silver)}
                            </p>
                          )}
                        </FormItem>
                      )}
                    />
                  </div>

                  <Separator className="my-4 sm:my-6" />

                  <div className="space-y-4 sm:space-y-6">
                    <FormField
                      control={form.control}
                      name="investments"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2 text-sm font-medium">
                            <TrendingUp className="h-4 w-4 flex-shrink-0" />
                            Investments
                          </FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                type="number"
                                step="0.01"
                                min="0"
                                placeholder="Stocks, bonds, crypto, etc."
                                {...field}
                                className="pl-8 h-11 text-base"
                                inputMode="decimal"
                              />
                              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm font-medium">
                                {symbol}
                              </div>
                            </div>
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="businessAssets"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2 text-sm font-medium">
                            <Briefcase className="h-4 w-4 flex-shrink-0" />
                            Business Assets
                          </FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                type="number"
                                step="0.01"
                                min="0"
                                placeholder="Inventory, equipment, business cash"
                                {...field}
                                className="pl-8 h-11 text-base"
                                inputMode="decimal"
                              />
                              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm font-medium">
                                {symbol}
                              </div>
                            </div>
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="propertyForTrading"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2 text-sm font-medium">
                            <Home className="h-4 w-4 flex-shrink-0" />
                            Investment Property
                          </FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                type="number"
                                step="0.01"
                                min="0"
                                placeholder="Real estate for resale/profit"
                                {...field}
                                className="pl-8 h-11 text-base"
                                inputMode="decimal"
                              />
                              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm font-medium">
                                {symbol}
                              </div>
                            </div>
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Liabilities Section */}
              <Card className="shadow-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <CircleDollarSign className="h-5 w-5 flex-shrink-0" />
                    Debts & Liabilities
                    <span className="text-sm font-normal text-muted-foreground">(Optional)</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="loans"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">Outstanding Loans</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              type="number"
                              step="0.01"
                              min="0"
                              placeholder="Personal loans, car loans, etc."
                              {...field}
                              className="pl-8 h-11 text-base"
                              inputMode="decimal"
                            />
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm font-medium">
                              {symbol}
                            </div>
                          </div>
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="bills"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">Immediate Bills</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              type="number"
                              step="0.01"
                              min="0"
                              placeholder="Rent, utilities, taxes due"
                              {...field}
                              className="pl-8 h-11 text-base"
                              inputMode="decimal"
                            />
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm font-medium">
                              {symbol}
                            </div>
                          </div>
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="wages"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">Employee Wages Due</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              type="number"
                              step="0.01"
                              min="0"
                              placeholder="Unpaid salaries, contractor fees"
                              {...field}
                              className="pl-8 h-11 text-base"
                              inputMode="decimal"
                            />
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm font-medium">
                              {symbol}
                          </div>
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Time Period Confirmation */}
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
                        <FormLabel className="text-base font-medium">
                          I have held these assets for at least one lunar year (354 days)
                        </FormLabel>
                        <FormDescription>
                          Zakat is only due on assets held for a complete lunar year. 
                          This is a fundamental requirement in Islamic law.
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </div>

          {/* Live Calculation Sidebar */}
          <div className="xl:col-span-1 order-1 xl:order-2">
            <Card className="shadow-sm xl:sticky xl:top-6">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-semibold">Live Calculation</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 sm:space-y-6">
                {/* Nisab Progress */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-muted-foreground">Nisab Progress</span>
                    <span className="text-sm font-bold">{nisabProgress.toFixed(0)}%</span>
                  </div>
                  <Progress value={nisabProgress} className="h-3" />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>{symbol}0</span>
                    <span>{symbol}{fmt(nisabThreshold)}</span>
                  </div>
                </div>

                <Separator />

                {/* Totals */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Total Assets</span>
                    <span className="font-semibold text-base">{symbol}{fmt(totalAssets)}</span>
                  </div>
                  
                  {totalLiabilities > 0 && (
                    <div className="flex justify-between">
                      <span className="text-sm">Total Liabilities</span>
                      <span className="font-medium text-red-600">-{symbol}{fmt(totalLiabilities)}</span>
                    </div>
                  )}
                  
                  <Separator />
                  
                  {totalLiabilities > 0 && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Total Liabilities</span>
                      <span className="font-semibold text-base text-red-600">-{symbol}{fmt(totalLiabilities)}</span>
                    </div>
                  )}
                  
                  <Separator />
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Net Wealth</span>
                    <span className="font-bold text-xl">{symbol}{fmt(netWealth)}</span>
                  </div>
                </div>

                <Separator />

                {/* Zakat Due */}
                <div className="text-center p-4 sm:p-6 rounded-lg border-2" style={{
                  borderColor: meetsNisab ? 'rgb(34, 197, 94)' : 'rgb(249, 115, 22)',
                  backgroundColor: meetsNisab ? 'rgb(240, 253, 244)' : 'rgb(255, 247, 237)'
                }}>
                  <div className="text-sm text-muted-foreground mb-2">
                    {meetsNisab ? "Zakat Due (2.5%)" : "Zakat Status"}
                  </div>
                  <div className="text-2xl sm:text-3xl font-bold" style={{
                    color: meetsNisab ? 'rgb(34, 197, 94)' : 'rgb(249, 115, 22)'
                  }}>
                    {symbol}{fmt(zakatDue)}
                  </div>
                  <div className="text-xs mt-2 font-medium" style={{
                    color: meetsNisab ? 'rgb(34, 197, 94)' : 'rgb(249, 115, 22)'
                  }}>
                    {meetsNisab ? "Payment Required" : "Not Due Yet"}
                  </div>
                </div>

                {priceError && (
                  <Alert className="border-amber-200 bg-amber-50">
                    <AlertCircle className="h-4 w-4 text-amber-600" />
                    <AlertDescription className="text-xs text-amber-800">{priceError}</AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Form>
  );
};

export default ZakatCalculator;