
import React, { useState, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
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

// Hardcoded values for demonstration
const NISAB_GOLD_GRAMS = 85;
const GOLD_PRICE_PER_GRAM = 65; // USD
const ZAKAT_RATE = 0.025;

const zakatFormSchema = z.object({
  cash: z.coerce.number().min(0).default(0),
  goldInGrams: z.coerce.number().min(0).default(0),
  silverInGrams: z.coerce.number().min(0).default(0),
  investments: z.coerce.number().min(0).default(0),
  liabilities: z.coerce.number().min(0).default(0),
});

type ZakatFormValues = z.infer<typeof zakatFormSchema>;

const ZakatCalculator: React.FC = () => {
  const [calculation, setCalculation] = useState<{ totalAssets: number; zakatDue: number; aboveNisab: boolean; nisabValue: number } | null>(null);

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

  const nisabValue = useMemo(() => NISAB_GOLD_GRAMS * GOLD_PRICE_PER_GRAM, []);

  function onSubmit(data: ZakatFormValues) {
    const goldValue = data.goldInGrams * GOLD_PRICE_PER_GRAM;
    const silverValue = data.silverInGrams * (GOLD_PRICE_PER_GRAM / 80); // Approx silver price
    const totalAssets = data.cash + goldValue + silverValue + data.investments;
    const netAssets = totalAssets - data.liabilities;
    
    if (netAssets >= nisabValue) {
      const zakatDue = netAssets * ZAKAT_RATE;
      setCalculation({ totalAssets: netAssets, zakatDue, aboveNisab: true, nisabValue });
    } else {
      setCalculation({ totalAssets: netAssets, zakatDue: 0, aboveNisab: false, nisabValue });
    }
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
        Note: This is a simplified calculator. Gold price is assumed at ${GOLD_PRICE_PER_GRAM}/g. For an accurate calculation, please consult a qualified scholar.
      </p>
    </div>
  );
};

export default ZakatCalculator;
