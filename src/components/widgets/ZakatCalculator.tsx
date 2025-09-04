import React, { useEffect, useMemo, useRef, useState } from 'react';
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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Calculator, CheckCircle, Info, Shield, TrendingUp, RotateCcw } from 'lucide-react';

// Pricing constants (placeholder values; can be wired to live data later)
const GOLD_PRICE_PER_GRAM = 75;
const SILVER_PRICE_PER_GRAM = 0.95;
const NISAB_GOLD_GRAMS = 85;
const ZAKAT_RATE = 0.025;

const zakatFormSchema = z.object({
	cash: z.coerce.number().min(0, 'Must be 0 or more').default(0),
	goldInGrams: z.coerce.number().min(0, 'Must be 0 or more').default(0),
	silverInGrams: z.coerce.number().min(0, 'Must be 0 or more').default(0),
	investments: z.coerce.number().min(0, 'Must be 0 or more').default(0),
	liabilities: z.coerce.number().min(0, 'Must be 0 or more').default(0),
});

type ZakatFormValues = z.infer<typeof zakatFormSchema>;

type Step = 1 | 2 | 3;

const parseNumber = (value: unknown): number => {
	if (typeof value === 'number') return isNaN(value) || value < 0 ? 0 : value;
	if (typeof value === 'string') {
		const t = value.trim();
		if (!t) return 0;
		const n = Number(t);
		return isNaN(n) || n < 0 ? 0 : n;
	}
	return 0;
};

const STORAGE_KEY = 'nisab_zakat_form_v1';

const ZakatCalculator: React.FC = () => {
	const [currentStep, setCurrentStep] = useState<Step>(1);
	const resultsRegionRef = useRef<HTMLDivElement | null>(null);

	const form = useForm<ZakatFormValues>({
		resolver: zodResolver(zakatFormSchema),
		defaultValues: {
			cash: 0,
			goldInGrams: 0,
			silverInGrams: 0,
			investments: 0,
			liabilities: 0,
		},
		mode: 'onBlur'
	});

	// Load from localStorage
	useEffect(() => {
		try {
			const raw = localStorage.getItem(STORAGE_KEY);
			if (raw) {
				const parsed = JSON.parse(raw);
				form.reset({
					cash: parseNumber(parsed.cash),
					goldInGrams: parseNumber(parsed.goldInGrams),
					silverInGrams: parseNumber(parsed.silverInGrams),
					investments: parseNumber(parsed.investments),
					liabilities: parseNumber(parsed.liabilities)
				});
			}
		} catch {}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	// Persist to localStorage
	const watchAll = form.watch();
	useEffect(() => {
		const toSave = {
			cash: parseNumber(watchAll.cash),
			goldInGrams: parseNumber(watchAll.goldInGrams),
			silverInGrams: parseNumber(watchAll.silverInGrams),
			investments: parseNumber(watchAll.investments),
			liabilities: parseNumber(watchAll.liabilities)
		};
		try {
			localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
		} catch {}
	}, [watchAll.cash, watchAll.goldInGrams, watchAll.silverInGrams, watchAll.investments, watchAll.liabilities]);

	// Normalized values
	const cash = useMemo(() => parseNumber(watchAll.cash), [watchAll.cash]);
	const investments = useMemo(() => parseNumber(watchAll.investments), [watchAll.investments]);
	const goldGrams = useMemo(() => parseNumber(watchAll.goldInGrams), [watchAll.goldInGrams]);
	const silverGrams = useMemo(() => parseNumber(watchAll.silverInGrams), [watchAll.silverInGrams]);
	const liabilities = useMemo(() => parseNumber(watchAll.liabilities), [watchAll.liabilities]);

	const goldValue = useMemo(() => goldGrams * GOLD_PRICE_PER_GRAM, [goldGrams]);
	const silverValue = useMemo(() => silverGrams * SILVER_PRICE_PER_GRAM, [silverGrams]);
	const totalAssets = useMemo(() => cash + investments + goldValue + silverValue, [cash, investments, goldValue, silverValue]);
	const netAssets = useMemo(() => Math.max(0, totalAssets - liabilities), [totalAssets, liabilities]);
	const nisabValue = useMemo(() => NISAB_GOLD_GRAMS * GOLD_PRICE_PER_GRAM, []);
	const aboveNisab = useMemo(() => netAssets >= nisabValue, [netAssets, nisabValue]);
	const zakatDue = useMemo(() => (aboveNisab ? netAssets * ZAKAT_RATE : 0), [aboveNisab, netAssets]);

	function onSubmit() {
		// Move focus to results on submit for SR users
		resultsRegionRef.current?.focus();
		setCurrentStep(3);
	}

	const goNext = () => setCurrentStep((s) => (Math.min(3, (s + 1)) as Step));
	const goBack = () => setCurrentStep((s) => (Math.max(1, (s - 1)) as Step));

	const resetAll = () => {
		form.reset({ cash: 0, investments: 0, goldInGrams: 0, silverInGrams: 0, liabilities: 0 });
		try { localStorage.removeItem(STORAGE_KEY); } catch {}
		setCurrentStep(1);
	};

	const StepItem = ({ step, label }: { step: Step; label: string }) => {
		const isActive = currentStep === step;
		const isDone = currentStep > step;
		return (
			<div className="flex items-center gap-2" aria-current={isActive ? 'step' : undefined}>
				<div
					className={
						"h-8 w-8 rounded-full flex items-center justify-center border text-sm font-semibold " +
						(isDone
							? "bg-brand-teal text-white border-brand-teal"
							: isActive
								? "bg-brand-teal/10 text-brand-teal border-brand-teal/30"
								: "bg-muted text-muted-foreground border-border")
					}
					role="listitem"
				>
					{isDone ? <CheckCircle className="h-4 w-4" aria-hidden /> : step}
				</div>
				<div className={"text-sm font-medium " + (isActive ? "text-brand-teal" : "text-muted-foreground")}>{label}</div>
			</div>
		);
	};

	return (
		<div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
			<Card className="border-0 shadow-sm mb-4 sm:mb-6" role="region" aria-label="Zakat calculator steps">
				<CardContent className="p-4 sm:p-6">
					<div className="flex flex-col gap-3 sm:gap-0 sm:flex-row sm:items-center sm:justify-between">
						<div className="flex items-center gap-4" role="list" aria-label="Steps">
							<StepItem step={1} label="Assets" />
							<div className="hidden sm:block h-px w-10 bg-border" />
							<StepItem step={2} label="Liabilities" />
							<div className="hidden sm:block h-px w-10 bg-border" />
							<StepItem step={3} label="Summary" />
						</div>
						<div className="hidden sm:flex items-center gap-3 text-xs text-muted-foreground">
							<Shield className="h-4 w-4" aria-hidden />
							<span>Shariah-aware calculation · 2.5% rate</span>
						</div>
					</div>
				</CardContent>
			</Card>

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				{/* Left: Form */}
				<Card className="border-0 shadow-sm lg:col-span-2">
					<CardHeader className="pb-2">
						<CardTitle className="flex items-center gap-2 text-xl sm:text-2xl text-brand-teal">
							<Calculator className="h-5 w-5 sm:h-6 sm:w-6" aria-hidden /> Zakat Calculator
						</CardTitle>
						<p className="text-sm text-muted-foreground">Provide your assets and liabilities to see your Zakat due.</p>
					</CardHeader>
					<CardContent className="p-4 sm:p-6">
						<Form {...form}>
							<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6" noValidate>
								{currentStep === 1 && (
									<div className="space-y-4">
										<h3 className="text-sm font-semibold text-green-700 dark:text-green-300">Assets</h3>
										<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
											<FormField
												control={form.control}
												name="cash"
												render={({ field }) => (
													<FormItem>
														<FormLabel>Cash & Bank ($)</FormLabel>
														<FormControl>
															<Input type="number" inputMode="decimal" placeholder="0.00" className="h-12" {...field} aria-describedby="cash-help" />
														</FormControl>
														<p id="cash-help" className="text-xs text-muted-foreground">Include cash on hand and checking/savings balances.</p>
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
															<Input type="number" inputMode="decimal" placeholder="0.00" className="h-12" {...field} aria-describedby="inv-help" />
														</FormControl>
														<p id="inv-help" className="text-xs text-muted-foreground">Include liquid investments (stocks, mutual funds) at current value.</p>
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
															<Input type="number" inputMode="decimal" placeholder="0" className="h-12" {...field} aria-describedby="gold-help" />
														</FormControl>
														<p id="gold-help" className="text-xs text-muted-foreground">Enter total grams of gold you own (market price applied automatically).</p>
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
															<Input type="number" inputMode="decimal" placeholder="0" className="h-12" {...field} aria-describedby="silver-help" />
														</FormControl>
														<p id="silver-help" className="text-xs text-muted-foreground">Enter total grams of silver you own (market price applied automatically).</p>
														<FormMessage />
													</FormItem>
												)}
											/>
										</div>
									</div>
								)}

								{currentStep === 2 && (
									<div className="space-y-4">
										<h3 className="text-sm font-semibold text-red-700 dark:text-red-300">Liabilities</h3>
										<FormField
											control={form.control}
											name="liabilities"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Short-term Liabilities ($)</FormLabel>
													<FormControl>
														<Input type="number" inputMode="decimal" placeholder="0.00" className="h-12" {...field} aria-describedby="liab-help" />
													</FormControl>
													<p id="liab-help" className="text-xs text-muted-foreground">Include immediate debts due within one lunar year.</p>
													<FormMessage />
												</FormItem>
											)}
										/>
									</div>
								)}

								{currentStep === 3 && (
									<div className="space-y-4">
										<h3 className="text-sm font-semibold text-foreground">Review & Calculate</h3>
										<div className="rounded-lg border border-border p-4 bg-card/50">
											<div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
												<div className="flex justify-between"><span className="text-muted-foreground">Cash</span><span className="font-medium">${cash.toFixed(2)}</span></div>
												<div className="flex justify-between"><span className="text-muted-foreground">Investments</span><span className="font-medium">${investments.toFixed(2)}</span></div>
												<div className="flex justify-between"><span className="text-muted-foreground">Gold ({goldGrams}g)</span><span className="font-medium">${goldValue.toFixed(2)}</span></div>
												<div className="flex justify-between"><span className="text-muted-foreground">Silver ({silverGrams}g)</span><span className="font-medium">${silverValue.toFixed(2)}</span></div>
												<div className="flex justify-between"><span className="text-muted-foreground">Liabilities</span><span className="font-medium">-${liabilities.toFixed(2)}</span></div>
											</div>
											<Separator className="my-3" />
											<div className="flex justify-between text-base"><span className="font-semibold">Net Assets</span><span className="font-semibold">${netAssets.toFixed(2)}</span></div>
											<div className="flex justify-between text-sm"><span className="text-muted-foreground">Nisab Threshold</span><span className="font-medium">${nisabValue.toFixed(2)}</span></div>
										</div>
									</div>
								)}

								<div className="flex flex-col sm:flex-row gap-3 pt-2">
									{currentStep > 1 && (
										<Button type="button" variant="outline" onClick={goBack} className="flex-1 sm:flex-none">
											Back
										</Button>
									)}
									{currentStep < 3 ? (
										<Button type="button" onClick={goNext} className="flex-1 sm:flex-none">
											Continue
										</Button>
									) : (
										<div className="flex w-full gap-3">
											<Button type="submit" className="flex-1">Calculate Zakat</Button>
											<Button type="button" variant="ghost" onClick={resetAll} className="sm:flex-none flex-1 sm:flex-initial" aria-label="Reset">
												<RotateCcw className="h-4 w-4" />
												<span className="sr-only">Reset</span>
											</Button>
										</div>
									)}
								</div>
							</form>
						</Form>
					</CardContent>
				</Card>

				{/* Right: Sticky Summary */}
				<div className="lg:col-span-1">
					<div className="lg:sticky lg:top-24 space-y-4">
						<Card className="border-0 shadow-md" role="region" aria-live="polite" aria-label="Zakat summary" tabIndex={-1} ref={resultsRegionRef}>
							<CardHeader className="pb-3">
								<CardTitle className="text-lg">Summary</CardTitle>
							</CardHeader>
							<CardContent className="space-y-3">
								<div className="flex justify-between text-sm"><span className="text-muted-foreground">Total Assets</span><span className="font-medium">${totalAssets.toFixed(2)}</span></div>
								<div className="flex justify-between text-sm"><span className="text-muted-foreground">Liabilities</span><span className="font-medium">-${liabilities.toFixed(2)}</span></div>
								<Separator />
								<div className="flex justify-between text-base"><span className="font-semibold">Net Assets</span><span className="font-semibold">${netAssets.toFixed(2)}</span></div>
								<div className="flex justify-between text-xs"><span className="text-muted-foreground">Nisab Threshold</span><span className="font-medium">${nisabValue.toFixed(2)}</span></div>
								<div className="rounded-md p-3 " style={{ backgroundColor: 'hsl(142 71% 45% / 0.08)' }}>
									<div className="text-xs text-green-700 dark:text-green-300 mb-1">Zakat Due (2.5%)</div>
									<div className="text-2xl font-bold text-green-700 dark:text-green-300">${zakatDue.toFixed(2)}</div>
								</div>
								{!aboveNisab && (
									<p className="text-xs text-amber-600 dark:text-amber-400">Your wealth is below the Nisab threshold. No Zakat is due.</p>
								)}
							</CardContent>
						</Card>

						<Card className="border-0">
							<CardContent className="p-4 space-y-3 text-xs text-muted-foreground">
								<div className="flex items-start gap-2"><Info className="h-4 w-4 mt-0.5" aria-hidden /><p>Gold ${GOLD_PRICE_PER_GRAM.toFixed(2)}/g, Silver ${SILVER_PRICE_PER_GRAM.toFixed(2)}/g are estimates. Verify current market prices.</p></div>
								<div className="flex items-start gap-2"><TrendingUp className="h-4 w-4 mt-0.5" aria-hidden /><p>Nisab uses 85g of gold criterion. Some opinions use silver; consult a scholar.</p></div>
							</CardContent>
						</Card>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ZakatCalculator;
