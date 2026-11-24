import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { contrastRatio } from '@/lib/contrast';
import { resolveFlags } from '@/lib/flags';
import { contentSecurityPolicy, securityHeaders } from '@/lib/security/headers';
import { localePath } from '@/lib/i18n/config';
import en from '@/content/locales/en.json';

describe('colour tokens meet WCAG AA (docs/04 §4)', () => {
  const css = readFileSync('app/globals.css', 'utf8');
  const block = (selector: string) => {
    const start = css.indexOf(selector);
    return css.slice(start, css.indexOf('}', start));
  };
  const token = (blockText: string, name: string) => {
    const m = new RegExp(`--${name}:\\s*(#[0-9a-fA-F]{6})`).exec(blockText);
    if (!m?.[1]) throw new Error(`token ${name} missing`);
    return m[1];
  };
  for (const theme of [":root,\n[data-theme='light']", "[data-theme='dark']"]) {
    const b = block(theme);
    it(`${theme.split('\n').pop()}: text and muted text on every surface`, () => {
      for (const surface of ['surface', 'surface-alt', 'surface-raised']) {
        expect(contrastRatio(token(b, 'fg'), token(b, surface))).toBeGreaterThanOrEqual(7);
        expect(contrastRatio(token(b, 'fg-muted'), token(b, surface))).toBeGreaterThanOrEqual(4.5);
      }
    });
  }
  it('primary button text passes', () =>
    expect(contrastRatio('#FFFFFF', '#487537')).toBeGreaterThanOrEqual(4.5));
  it('ink on marigold (top bar) passes', () =>
    expect(contrastRatio('#251A10', '#F0A023')).toBeGreaterThanOrEqual(4.5));
});

describe('feature flags', () => {
  it('ships change requests dark in production and on elsewhere', () => {
    expect(resolveFlags('production').dark_home).toBe(false);
    expect(resolveFlags('staging').dark_home).toBe(true);
  });
  it('honours overrides', () => {
    expect(resolveFlags('staging', '-dark_home').dark_home).toBe(false);
    expect(resolveFlags('production', 'dark_home').dark_home).toBe(true);
  });
});

describe('security headers (docs/07 §3)', () => {
  const csp = contentSecurityPolicy({ isDev: false });
  it('blocks framing, plugins and foreign forms', () => {
    expect(csp).toContain("frame-ancestors 'none'");
    expect(csp).toContain("object-src 'none'");
    expect(csp).toContain("form-action 'self' https://api.razorpay.com");
  });
  it('never allows eval in production', () => expect(csp).not.toContain('unsafe-eval'));
  it('sends HSTS only outside development', () => {
    expect(
      securityHeaders({ isDev: false }).some((h) => h.key === 'Strict-Transport-Security'),
    ).toBe(true);
    expect(
      securityHeaders({ isDev: true }).some((h) => h.key === 'Strict-Transport-Security'),
    ).toBe(false);
  });
});

describe('i18n', () => {
  it('keeps English at the root', () => {
    expect(localePath('en', '/science')).toBe('/science');
    expect(localePath('hi', '/science')).toBe('/hi/science');
    expect(localePath('hi', '/')).toBe('/hi');
  });
  it('uses flat dotted keys with string values', () => {
    for (const [key, value] of Object.entries(en)) {
      expect(key).toMatch(/^[a-z0-9_]+(\.[a-z0-9_]+)+$/);
      expect(typeof value).toBe('string');
    }
  });
});
