import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Calculator, ArrowRight, DollarSign, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function HomepageZakatWidget() {
  const [wealth, setWealth] = useState('');
  const [result, setResult] = useState<number | null>(null);
  const navigate = useNavigate();

  // Simplified Nisab calculation (current gold price ~$2000/oz, 87.48g gold = ~$5600)
  const NISAB_THRESHOLD = 5600; // Approximate in USD
  const ZAKAT_RATE = 0.025; // 2.5%

  const calculateZakat = () => {
    const wealthAmount = parseFloat(wealth);
    if (wealthAmount >= NISAB_THRESHOLD) {
      setResult(wealthAmount * ZAKAT_RATE);
    } else {
      setResult(0);
    }
  };

  const handleFullCalculator = () => {
    navigate('/zakat-calculator');
  };

  return (
    <section className="section-padding bg-white dark:bg-card">
      <div className="container mx-auto">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-brand-teal/10 text-brand-teal px-4 py-2 rounded-full text-sm font-medium mb-4">
              <Calculator className="h-4 w-4" />
              Try Our Most Popular Tool
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-brand-teal mb-4" style={{ fontFamily: "'Lora', serif" }}>
              Quick Zakat Calculator
            </h2>
            <p className="text-lg text-muted-foreground">
              Calculate your Zakat obligation in seconds. Get started with our simplified calculator.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <Card className="p-8">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Total Wealth (USD)
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                      type="number"
                      placeholder="Enter your total wealth"
                      value={wealth}
                      onChange={(e) => setWealth(e.target.value)}
                      className="pl-10 text-lg h-12"
                    />
                  </div>
                </div>

                <Button
                  onClick={calculateZakat}
                  className="w-full bg-brand-teal hover:bg-brand-teal-light text-white h-12 text-lg"
                  disabled={!wealth}
                >
                  Calculate Zakat
                  <Calculator className="h-5 w-5 ml-2" />
                </Button>

                {result !== null && (
                  <div className="text-center p-6 bg-brand-teal/5 rounded-lg border border-brand-teal/20">
                    {result > 0 ? (
                      <>
                        <div className="text-3xl font-bold text-brand-teal mb-2">
                          ${result.toFixed(2)}
                        </div>
                        <p className="text-sm text-muted-foreground mb-4">
                          Your Zakat obligation for this year
                        </p>
                        <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                          Above Nisab threshold
                        </Badge>
                      </>
                    ) : (
                      <>
                        <div className="text-2xl font-bold text-muted-foreground mb-2">
                          No Zakat Due
                        </div>
                        <p className="text-sm text-muted-foreground mb-4">
                          Your wealth is below the Nisab threshold of ${NISAB_THRESHOLD.toLocaleString()}
                        </p>
                        <Badge variant="outline">
                          Below Nisab threshold
                        </Badge>
                      </>
                    )}
                  </div>
                )}

                <Button
                  variant="outline"
                  onClick={handleFullCalculator}
                  className="w-full border-brand-teal text-brand-teal hover:bg-brand-teal/5"
                >
                  Use Full Calculator
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </Card>

            <div className="space-y-6">
              <div className="bg-slate-50 dark:bg-muted/20 p-6 rounded-lg">
                <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-brand-teal" />
                  Zakat Calculation Breakdown
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Nisab Threshold (2024):</span>
                    <span className="font-medium">${NISAB_THRESHOLD.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Zakat Rate:</span>
                    <span className="font-medium">2.5%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Calculation Method:</span>
                    <span className="font-medium">Gold Standard</span>
                  </div>
                </div>
              </div>

              <div className="bg-brand-teal/5 p-6 rounded-lg border border-brand-teal/20">
                <h4 className="font-semibold text-brand-teal mb-3">What counts as wealth?</h4>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li>• Cash and savings</li>
                  <li>• Gold and silver jewelry</li>
                  <li>• Investment accounts</li>
                  <li>• Business inventory</li>
                  <li>• Cryptocurrency holdings</li>
                </ul>
              </div>

              <div className="text-center">
                <p className="text-xs text-muted-foreground">
                  This is a simplified calculator. For detailed Zakat calculations including different asset types, 
                  debts, and scholarly opinions, use our comprehensive calculator.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}