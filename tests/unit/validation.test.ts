import { describe, expect, it } from 'vitest';
import {
  gstinChecksumChar,
  isValidGstin,
  isValidPincode,
  normalizeIndianMobile,
} from '@/lib/validation';

describe('normalizeIndianMobile', () => {
  it.each([
    ['9876543210', '+919876543210'],
    ['98765 43210', '+919876543210'],
    ['+91-98765-43210', '+919876543210'],
    ['09876543210', '+919876543210'],
    ['919876543210', '+919876543210'],
  ])('accepts %s', (input, expected) => expect(normalizeIndianMobile(input)).toBe(expected));

  it.each(['5876543210', '987654321', '98765432101', 'abcdefghij', '', '+1 415 555 0100'])(
    'rejects %s',
    (input) => expect(normalizeIndianMobile(input)).toBeNull(),
  );
});

describe('isValidPincode', () => {
  it('accepts six digits not starting with 0', () => expect(isValidPincode('560001')).toBe(true));
  it.each(['060001', '56000', '5600011', '56o001'])('rejects %s', (p) =>
    expect(isValidPincode(p)).toBe(false),
  );
});

describe('GSTIN', () => {
  // Synthetic GSTINs built with the published check-character algorithm, not real businesses.
  const body = '29ABCDE1234F1Z';
  const valid = body + gstinChecksumChar(body);

  it('accepts a GSTIN with the right check character', () =>
    expect(isValidGstin(valid)).toBe(true));
  it('is case-insensitive', () => expect(isValidGstin(valid.toLowerCase())).toBe(true));
  it('rejects a wrong check character', () => {
    const wrong = body + (valid.endsWith('A') ? 'B' : 'A');
    expect(isValidGstin(wrong)).toBe(false);
  });
  it('rejects a bad format or state code', () => {
    expect(isValidGstin('29ABCDE1234F1Y5')).toBe(false);
    const bad = '99ABCDE1234F1Z';
    expect(isValidGstin(bad + gstinChecksumChar(bad))).toBe(false);
  });
});
