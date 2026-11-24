import { describe, expect, it, vi } from 'vitest';
import { getTranslator } from '@/lib/i18n/dictionary';
import { waLink } from '@/lib/wa';
import { findPii, track } from '@/lib/track';

const t = getTranslator('en');

describe('waLink', () => {
  it('uses the configured number and the docs/06 message', () => {
    const url = new URL(waLink(t, 'top_bar'));
    expect(url.origin + url.pathname).toBe('https://wa.me/919182968542');
    expect(url.searchParams.get('text')).toBe("Hi ColdEasy, I'd like to know more.");
  });
  it('fills context variables', () => {
    const url = new URL(waLink(t, 'product', { product: 'ColdEasy Box' }));
    expect(url.searchParams.get('text')).toBe(
      "Hi ColdEasy, I'm interested in the ColdEasy Box. (from your website)",
    );
  });
});

describe('track', () => {
  it('flags personal data', () => {
    expect(findPii({ context: 'footer' })).toBeNull();
    expect(findPii({ item_id: 'CE-BOX', item_name: 'ColdEasy Box' })).toBeNull();
    expect(findPii({ mobile: 'x' })).toBe('mobile');
    expect(findPii({ context: 'call 98765 43210' })).toBe('context');
    expect(findPii({ form_type: 'a@b.co' })).toBe('form_type');
    expect(findPii({ items: [{ item_id: 'x', item_name: 'y', pincode: '560001' }] })).toBe(
      'items[0].pincode',
    );
  });
  it('drops an event with personal data and never calls gtag', () => {
    const gtag = vi.fn();
    vi.stubGlobal('window', { gtag });
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    expect(track('generate_lead', { form_type: 'me@example.com' })).toBe(false);
    expect(track('generate_lead', { form_type: 'bulk' })).toBe(true);
    expect(gtag).toHaveBeenCalledTimes(1);
    vi.unstubAllGlobals();
  });
});
