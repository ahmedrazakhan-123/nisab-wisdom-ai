import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Calculator, ArrowRight, DollarSign, TrendingUp, Info } from 'lucide-react';
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
    <section className="py-12 sm:py-16 lg:py-20 bg-white dark:bg-card">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-8 sm:mb-12">
            <div className="inline-flex items-center gap-2 bg-brand-teal/10 text-brand-teal px-3 py-2 rounded-full text-xs sm:text-sm font-medium mb-4">
              <Calculator className="h-3 w-3 sm:h-4 sm:w-4" />
              Try Our Most Popular Tool
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-brand-teal mb-3 sm:mb-4" style={{ fontFamily: "'Lora', serif" }}>
              Quick Zakat Calculator
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
              Calculate your Zakat obligation in seconds. Get started with our simplified calculator.
            </p>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 items-start">
            {/* Calculator Card */}
            <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-gray-50/50 dark:from-card dark:to-card/50">
              <CardHeader className="pb-6">
                <CardTitle className="text-xl sm:text-2xl font-bold text-brand-teal">
                  Calculate Your Zakat
                </CardTitle>
                <p className="text-sm sm:text-base text-muted-foreground">
                  Enter your total wealth to get an instant calculation
                </p>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-3">
                    Total Wealth (USD)
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                      type="number"
                      placeholder="Enter your total wealth"
                      value={wealth}
                      onChange={(e) => setWealth(e.target.value)}
                      className="pl-10 text-base sm:text-lg h-12 sm:h-14"
                    />
                  </div>
                </div>

                <Button
                  onClick={calculateZakat}
                  className="w-full bg-brand-teal hover:bg-brand-teal/90 text-white h-12 sm:h-14 text-base sm:text-lg font-semibold"
                  disabled={!wealth}
                >
                  Calculate Zakat
                  <Calculator className="h-4 w-4 sm:h-5 sm:w-5 ml-2" />
                </Button>

                {/* Results Section */}
                {result !== null && (
                  <div className="text-center p-4 sm:p-6 bg-brand-teal/5 rounded-lg border border-brand-teal/20">
                    {result > 0 ? (
                      <>
                        <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-brand-teal mb-2">
                          ${result.toFixed(2)}
                        </div>
                        <p className="text-sm sm:text-base text-muted-foreground mb-4">
                          Your Zakat obligation for this year
                        </p>
                        <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 text-xs sm:text-sm">
                          Above Nisab threshold
                        </Badge>
                      </>
                    ) : (
                      <>
                        <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-muted-foreground mb-2">
                          No Zakat Due
                        </div>
                        <p className="text-sm sm:text-base text-muted-foreground mb-4">
                          Your wealth is below the Nisab threshold of ${NISAB_THRESHOLD.toLocaleString()}
                        </p>
                        <Badge variant="outline" className="text-xs sm:text-sm">
                          Below Nisab threshold
                        </Badge>
                      </>
                    )}
                  </div>
                )}

                <Button
                  variant="outline"
                  onClick={handleFullCalculator}
                  className="w-full border-brand-teal text-brand-teal hover:bg-brand-teal/5 h-12 sm:h-14 text-base sm:text-lg"
                >
                  Use Full Calculator
                  <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 ml-2" />
                </Button>
              </CardContent>
            </Card>

            {/* Information Cards */}
            <div className="space-y-4 sm:space-y-6">
              {/* Calculation Breakdown */}
              <Card className="shadow-sm border-0 bg-slate-50 dark:bg-muted/20">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-brand-teal" />
                    Zakat Calculation Breakdown
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                    <div className="flex justify-between items-center p-2 bg-white/50 dark:bg-card/50 rounded">
                      <span className="text-muted-foreground">Nisab Threshold:</span>
                      <span className="font-medium">${NISAB_THRESHOLD.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-white/50 dark:bg-card/50 rounded">
                      <span className="text-muted-foreground">Zakat Rate:</span>
                      <span className="font-medium">2.5%</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-white/50 dark:bg-card/50 rounded sm:col-span-2">
                      <span className="text-muted-foreground">Calculation Method:</span>
                      <span className="font-medium">Gold Standard</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* What Counts as Wealth */}
              <Card className="shadow-sm border-0 bg-brand-teal/5 border-brand-teal/20">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg font-semibold text-brand-teal">
                    What counts as wealth?
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="text-sm sm:text-base text-muted-foreground space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="text-brand-teal mt-1">•</span>
                      <span>Cash and savings</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-brand-teal mt-1">•</span>
                      <span>Gold and silver jewelry</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-brand-teal mt-1">•</span>
                      <span>Investment accounts</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-brand-teal mt-1">•</span>
                      <span>Business inventory</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-brand-teal mt-1">•</span>
                      <span>Cryptocurrency holdings</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              {/* Disclaimer */}
              <Card className="shadow-sm border-amber-200 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-950/20">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-start gap-3">
                    <Info className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
                    <div className="space-y-2">
                      <h4 className="font-semibold text-amber-800 dark:text-amber-200 text-sm sm:text-base">
                        Simplified Calculator
                      </h4>
                      <p className="text-xs sm:text-sm text-amber-700 dark:text-amber-300 leading-relaxed">
                        This is a simplified calculator. For detailed Zakat calculations including different asset types, 
                        debts, and scholarly opinions, use our comprehensive calculator.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}