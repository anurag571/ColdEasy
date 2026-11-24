/**
 * Input validation shared by forms and server routes (B1-07 / T-045).
 * Formats follow docs/05: mobile as +91 E.164, six-digit pincode, GSTIN format and checksum.
 * A valid format does not prove a number or GSTIN is real (docs/05 §8).
 */

/** Accepts what people type ("98765 43210", "+91-98765-43210", "098765...") and returns +91XXXXXXXXXX. */
export function normalizeIndianMobile(input: string): string | null {
  let digits = input.replace(/[^\d]/g, '');
  if (digits.length === 12 && digits.startsWith('91')) digits = digits.slice(2);
  else if (digits.length === 11 && digits.startsWith('0')) digits = digits.slice(1);
  if (!/^[6-9]\d{9}$/.test(digits)) return null;
  return `+91${digits}`;
}

export function isValidIndianMobile(input: string): boolean {
  return normalizeIndianMobile(input) !== null;
}

/** Six digits, not starting with 0. Serviceability is a separate database lookup. */
export function isValidPincode(input: string): boolean {
  return /^[1-9]\d{5}$/.test(input.trim());
}

const GSTIN_CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const GSTIN_FORMAT = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/;

export function gstinChecksumChar(first14: string): string {
  let sum = 0;
  for (let i = 0; i < 14; i++) {
    const value = GSTIN_CHARS.indexOf(first14[i] ?? '');
    if (value < 0) return '';
    const product = value * (i % 2 === 0 ? 1 : 2);
    sum += Math.floor(product / 36) + (product % 36);
  }
  return GSTIN_CHARS[(36 - (sum % 36)) % 36] ?? '';
}

/** Format (same regex as the orders.gstin check in docs/05) plus the check character. */
export function isValidGstin(input: string): boolean {
  const gstin = input.trim().toUpperCase();
  if (!GSTIN_FORMAT.test(gstin)) return false;
  const stateCode = Number(gstin.slice(0, 2));
  if (stateCode < 1 || stateCode > 38) return false;
  return gstinChecksumChar(gstin.slice(0, 14)) === gstin[14];
}
