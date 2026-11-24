/**
 * Money is whole paise (integers) everywhere: database, cart, API (docs/05 §1).
 * Never do arithmetic on rupee decimals. Only format at the edge.
 */

export type Paise = number;

export function assertPaise(value: number): asserts value is Paise {
  if (!Number.isSafeInteger(value) || value < 0) {
    throw new RangeError(`Expected a non-negative whole number of paise, got ${value}`);
  }
}

const inrWhole = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});
const inrExact = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

/** ₹1,23,456 for whole rupees, ₹1,23,456.50 when there are paise. Indian digit grouping. */
export function formatINR(paise: Paise): string {
  assertPaise(paise);
  return paise % 100 === 0 ? inrWhole.format(paise / 100) : inrExact.format(paise / 100);
}

export function rupeesToPaise(rupees: number): Paise {
  const paise = Math.round(rupees * 100);
  assertPaise(paise);
  return paise;
}

export function lineTotal(unitPaise: Paise, qty: number): Paise {
  assertPaise(unitPaise);
  if (!Number.isInteger(qty) || qty < 1 || qty > 20) throw new RangeError('qty must be 1 to 20');
  return unitPaise * qty;
}

export function sumPaise(values: Paise[]): Paise {
  return values.reduce((total, v) => {
    assertPaise(v);
    return total + v;
  }, 0);
}

/**
 * Tax contained in a GST-inclusive price, rounded to the nearest paisa.
 * Rate in basis points (1800 = 18%). Line-by-line rounding can differ from the order total
 * by a paisa (docs/05 §8): the accounting sync compares totals and holds mismatches.
 */
export function inclusiveTax(grossPaise: Paise, rateBps: number): Paise {
  assertPaise(grossPaise);
  if (!Number.isInteger(rateBps) || rateBps < 0 || rateBps > 2800) {
    throw new RangeError('GST rate must be 0 to 2800 basis points');
  }
  return Math.round((grossPaise * rateBps) / (10000 + rateBps));
}

/** Percentage off MRP, rounded down so we never overstate a discount. Null when there is none. */
export function discountPercent(mrpPaise: Paise, pricePaise: Paise): number | null {
  assertPaise(mrpPaise);
  assertPaise(pricePaise);
  if (mrpPaise === 0 || pricePaise >= mrpPaise) return null;
  return Math.floor(((mrpPaise - pricePaise) * 100) / mrpPaise);
}
