// Zakat Calculator Unit Tests
// Run with: deno test functions/tests/zakat.test.ts

import { assertEquals, assertAlmostEquals } from "https://deno.land/std@0.208.0/testing/asserts.ts";

// Zakat calculation functions (extracted from portfolio-analyzer)
function calculateZakat(totalWealth: number, nisabThreshold: number): number {
  if (totalWealth < nisabThreshold) return 0;
  return totalWealth * 0.025; // 2.5%
}

function calculateNisabThreshold(goldPricePerOunce: number, silverPricePerOunce: number): number {
  const goldNisab = goldPricePerOunce * 20; // 20 mithqals of gold (87.48g)
  const silverNisab = silverPricePerOunce * 200; // 200 dirhams of silver (612.36g)
  return Math.min(goldNisab, silverNisab); // Use the lower threshold
}

function isZakatApplicable(
  totalWealth: number,
  nisabThreshold: number,
  heldForOneYear: boolean
): boolean {
  return totalWealth >= nisabThreshold && heldForOneYear;
}

Deno.test("Zakat calculation - basic scenarios", () => {
  // Test 1: Below nisab threshold
  assertEquals(calculateZakat(5000, 7500), 0);
  
  // Test 2: Exactly at nisab threshold
  assertEquals(calculateZakat(7500, 7500), 187.5);
  
  // Test 3: Above nisab threshold
  assertEquals(calculateZakat(100000, 7500), 2500);
  
  // Test 4: Large amounts
  assertEquals(calculateZakat(1000000, 7500), 25000);
});

Deno.test("Nisab threshold calculation", () => {
  // Test with typical precious metal prices
  const goldPrice = 2000; // $2000 per ounce
  const silverPrice = 25;  // $25 per ounce
  
  const threshold = calculateNisabThreshold(goldPrice, silverPrice);
  
  // Gold nisab: 2000 * 20 = 40000
  // Silver nisab: 25 * 200 = 5000
  // Should use silver (lower)
  assertEquals(threshold, 5000);
});

Deno.test("Nisab threshold - edge cases", () => {
  // When gold is cheaper than silver ratio
  const goldPrice = 100;
  const silverPrice = 50;
  
  const threshold = calculateNisabThreshold(goldPrice, silverPrice);
  assertEquals(threshold, 2000); // Gold threshold is lower
});

Deno.test("Zakat applicability checks", () => {
  const nisab = 7500;
  
  // Wealth above nisab, held for one year
  assertEquals(isZakatApplicable(10000, nisab, true), true);
  
  // Wealth above nisab, NOT held for one year
  assertEquals(isZakatApplicable(10000, nisab, false), false);
  
  // Wealth below nisab, held for one year
  assertEquals(isZakatApplicable(5000, nisab, true), false);
  
  // Wealth below nisab, NOT held for one year
  assertEquals(isZakatApplicable(5000, nisab, false), false);
});

Deno.test("Zakat precision and rounding", () => {
  // Test decimal precision
  const result = calculateZakat(12345.67, 7500);
  assertAlmostEquals(result, 308.64175, 0.01);
});

Deno.test("Zakat calculation - real world scenarios", () => {
  const scenarios = [
    { wealth: 50000, nisab: 7500, expected: 1250 },
    { wealth: 75000, nisab: 7500, expected: 1875 },
    { wealth: 100000, nisab: 8000, expected: 2500 },
    { wealth: 7499, nisab: 7500, expected: 0 },
  ];
  
  scenarios.forEach(({ wealth, nisab, expected }) => {
    assertEquals(calculateZakat(wealth, nisab), expected);
  });
});

Deno.test("Deterministic results", () => {
  // Same inputs should always produce same outputs
  const wealth = 87654.32;
  const nisab = 7200;
  
  const result1 = calculateZakat(wealth, nisab);
  const result2 = calculateZakat(wealth, nisab);
  const result3 = calculateZakat(wealth, nisab);
  
  assertEquals(result1, result2);
  assertEquals(result2, result3);
  assertEquals(result1, 2191.358);
});