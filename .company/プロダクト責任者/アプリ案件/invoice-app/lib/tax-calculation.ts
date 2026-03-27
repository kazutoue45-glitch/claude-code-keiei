import type { LineItem, TaxBreakdown, TaxRate } from "@/types/invoice";
import { TAX_RATE_VALUES } from "./constants";

export function calculateTaxBreakdown(lineItems: LineItem[]): TaxBreakdown[] {
  const byRate = new Map<TaxRate, number>();

  for (const item of lineItems) {
    const current = byRate.get(item.taxRate) ?? 0;
    byRate.set(item.taxRate, current + item.subtotal);
  }

  const breakdown: TaxBreakdown[] = [];
  for (const [rate, taxableAmount] of byRate) {
    const rateValue = TAX_RATE_VALUES[rate] ?? 0;
    // 消費税は切り捨て（税率ごとに1回）
    const taxAmount = Math.floor(taxableAmount * rateValue);
    breakdown.push({ rate, taxableAmount, taxAmount });
  }

  // Sort: 10% → 8% → 0%
  breakdown.sort((a, b) => {
    const order: Record<string, number> = { "10%": 0, "8%": 1, "0%": 2 };
    return (order[a.rate] ?? 3) - (order[b.rate] ?? 3);
  });

  return breakdown;
}

export function calculateWithholdingTax(lineItems: LineItem[]): number {
  const targetSubtotal = lineItems
    .filter((item) => item.withholdingTaxTarget)
    .reduce((sum, item) => sum + item.subtotal, 0);

  if (targetSubtotal === 0) return 0;

  // 源泉徴収税額の計算
  // 100万円以下: 10.21%
  // 100万円超: 超過分に 20.42% + 102,100円
  if (targetSubtotal <= 1_000_000) {
    return Math.floor(targetSubtotal * 0.1021);
  }

  const excess = targetSubtotal - 1_000_000;
  return Math.floor(excess * 0.2042) + 102_100;
}

export function calculateTotals(lineItems: LineItem[]) {
  const taxBreakdown = calculateTaxBreakdown(lineItems);
  const subtotalExcludingTax = lineItems.reduce(
    (sum, item) => sum + item.subtotal,
    0
  );
  const totalTax = taxBreakdown.reduce((sum, b) => sum + b.taxAmount, 0);
  const totalWithTax = subtotalExcludingTax + totalTax;
  const withholdingTaxAmount = calculateWithholdingTax(lineItems);
  const finalAmount = totalWithTax - withholdingTaxAmount;

  return {
    taxBreakdown,
    subtotalExcludingTax,
    totalTax,
    totalWithTax,
    withholdingTaxAmount,
    finalAmount,
  };
}
