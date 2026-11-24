import { describe, expect, it } from 'vitest';
import {
  discountPercent,
  formatINR,
  inclusiveTax,
  lineTotal,
  rupeesToPaise,
  sumPaise,
} from '@/lib/money';

describe('money in paise', () => {
  it('formats with Indian grouping', () => {
    expect(formatINR(12345600)).toBe('₹1,23,456');
    expect(formatINR(12345650)).toBe('₹1,23,456.50');
    expect(formatINR(0)).toBe('₹0');
  });
  it('refuses fractions and negatives', () => {
    expect(() => formatINR(1.5)).toThrow();
    expect(() => formatINR(-1)).toThrow();
  });
  it('converts rupees without float drift', () => expect(rupeesToPaise(0.1 + 0.2)).toBe(30));
  it('limits quantity to 1..20 like order_items', () => {
    expect(lineTotal(100, 20)).toBe(2000);
    expect(() => lineTotal(100, 21)).toThrow();
    expect(() => lineTotal(100, 0)).toThrow();
  });
  it('sums', () => expect(sumPaise([100, 250])).toBe(350));
  it('extracts tax from a GST-inclusive price', () => {
    expect(inclusiveTax(11800, 1800)).toBe(1800);
    expect(inclusiveTax(10000, 0)).toBe(0);
  });
  it('rounds discounts down and returns null when there is none', () => {
    expect(discountPercent(10000, 6667)).toBe(33);
    expect(discountPercent(10000, 10000)).toBeNull();
  });
});
