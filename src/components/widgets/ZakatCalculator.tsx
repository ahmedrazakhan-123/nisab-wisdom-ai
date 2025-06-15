import React, { useState, useMemo, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Calculator } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

// Fallback values in case the API fails
const FALLBACK_GOLD_PRICE_PER_GRAM = 75; // More current estimate
const FALLBACK_SILVER_PRICE_PER_GRAM = 0.95; // More current estimate
const NISAB_GOLD_GRAMS = 85;
const ZAKAT_RATE = 0.025;

const zakatFormSchema = z.object({
  cash: z.coerce.number().min(0).default(0),
  goldInGrams: z.coerce.number().min(0).default(0),
  silverInGrams: z.coerce.number().min(0).default(0),
  investments: z.coerce.number().min(0).default(0),
  liabilities: z.coerce.number().min(0).default(0),
});

type ZakatFormValues = z.infer<typeof zakatFormSchema>;

const fetchMetalPrices = async () => {
    const response = await fetch('https://api.metals.live/v1/spot');
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    const data = await response.json();
    // API gives price per troy ounce. Convert to grams. (1 troy ounce = 31.1035 grams)
    const OUNCE_TO_GRAM_CONVERSION = 31.1035;
    const gold = data.find((m: any) => m.metal.toLowerCase() === 'gold');
    const silver = data.find((m: any) => m.metal.toLowerCase() === 'silver');

    if (!gold || !silver) {
        throw new Error('Could not find gold or silver prices in API response');
    }

    return {
        goldPricePerGram: gold.price / OUNCE_TO_GRAM_CONVERSION,
        silverPricePerGram: silver.price / OUNCE_TO_GRAM_CONVERSION,
    };
};


const ZakatCalculator: React.FC = () => {
  const [calculation, setCalculation] = useState<{ totalAssets: number; zakatDue: number; aboveNisab: boolean; nisabValue: number } | null>(null);
  const { toast } = useToast();

  const { data: metalPrices, isLoading: isLoadingPrices, isError } = useQuery({
      queryKey: ['metalPrices'],
      queryFn: fetchMetalPrices,
      staleTime: 1000 * 60 * 15, // Refetch every 15 minutes
      retry: 2,
  });

  useEffect(() => {
    if (isError) {
        toast({
            variant: "destructive",
            title: "Could not fetch live metal prices.",
            description: "Using recent estimates for calculation.",
            duration: 5000,
        });
    }
  }, [isError, toast]);

  const goldPricePerGram = metalPrices?.goldPricePerGram || FALLBACK_GOLD_PRICE_PER_GRAM;
  const silverPricePerGram = metalPrices?.silverPricePerGram || FALLBACK_SILVER_PRICE_PER_GRAM;

  const nisabValue = useMemo(() => NISAB_GOLD_GRAMS * goldPricePerGram, [goldPricePerGram]);

  const form = useForm<ZakatFormValues>({
    resolver: zodResolver(zakatFormSchema),
    defaultValues: {
      cash: 0,
      goldInGrams: 0,
      silverInGrams: 0,
      investments: 0,
      liabilities: 0,
    },
  });

  function onSubmit(data: ZakatFormValues) {
    const goldValue = data.goldInGrams * goldPricePerGram;
    const silverValue = data.silverInGrams * silverPricePerGram;
    const totalAssets = data.cash + goldValue + silverValue + data.investments;
    const netAssets = totalAssets - data.liabilities;
    
    if (netAssets >= nisabValue) {
      const zakatDue = netAssets * ZAKAT_RATE;
      setCalculation({ totalAssets: netAssets, zakatDue, aboveNisab: true, nisabValue });
    } else {
      setCalculation({ totalAssets: netAssets, zakatDue: 0, aboveNisab: false, nisabValue });
    }
  }

  if (isLoadingPrices) {
    return (
      <div className="mt-4 p-4 border rounded-lg bg-background/50 animate-pulse w-full">
        <h3 className="font-semibold mb-4 flex items-center gap-2 text-card-foreground"><Calculator size={18} /> Zakat Calculator</h3>
        <p className="text-muted-foreground mb-4">Fetching live metal prices...</p>
        <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2"><Skeleton className="h-4 w-24" /><Skeleton className="h-10 w-full" /></div>
                <div className="space-y-2"><Skeleton className="h-4 w-36" /><Skeleton className="h-10 w-full" /></div>
                <div className="space-y-2"><Skeleton className="h-4 w-24" /><Skeleton className="h-10 w-full" /></div>
                <div className="space-y-2"><Skeleton className="h-4 w-28" /><Skeleton className="h-10 w-full" /></div>
            </div>
            <div className="space-y-2"><Skeleton className="h-4 w-40" /><Skeleton className="h-10 w-full" /></div>
            <Skeleton className="h-10 w-36" />
        </div>
      </div>
    );
  }

  return (
    <div className="mt-4 p-4 border rounded-lg bg-background/50 animate-fade-in-up w-full">
        <h3 className="font-semibold mb-4 flex items-center gap-2 text-card-foreground"><Calculator size={18} /> Zakat Calculator</h3>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="cash"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cash & Bank ($)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="e.g., 5000" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="investments"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Stocks & Investments ($)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="e.g., 10000" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="goldInGrams"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Gold (grams)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="e.g., 100" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="silverInGrams"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Silver (grams)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="e.g., 700" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
              control={form.control}
              name="liabilities"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Short-term Liabilities ($)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="e.g., 2000" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          <Button type="submit">Calculate Zakat</Button>
        </form>
      </Form>

      {calculation && (
        <div className="mt-6 p-4 bg-muted/50 rounded-lg space-y-2 animate-fade-in">
          <h4 className="font-semibold text-lg text-card-foreground">Calculation Result</h4>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Net Zakatable Assets:</span>
            <span className="font-mono font-semibold">${calculation.totalAssets.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">Nisab Threshold (85g Gold):</span>
            <span className="font-mono">${nisabValue.toFixed(2)}</span>
          </div>
          <hr className="my-2 border-border/50" />
          {calculation.aboveNisab ? (
            <div className="flex justify-between items-center text-green-600 dark:text-green-400">
              <span className="font-semibold">Zakat Due (2.5%):</span>
              <span className="text-xl font-bold font-mono">${calculation.zakatDue.toFixed(2)}</span>
            </div>
          ) : (
            <p className="text-amber-600 dark:text-amber-400">Your wealth is below the Nisab threshold. No Zakat is due.</p>
          )}
        </div>
      )}
       <p className="text-xs text-muted-foreground mt-4">
        Note: This calculator uses live market prices for gold (${goldPricePerGram.toFixed(2)}/g) and silver (${silverPricePerGram.toFixed(2)}/g). This is for informational purposes. For an accurate calculation, please consult a qualified scholar.
      </p>
    </div>
  );
};

export default ZakatCalculator;
