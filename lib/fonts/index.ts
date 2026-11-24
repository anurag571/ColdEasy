import localFont from 'next/font/local';

export const montserrat = localFont({
  src: [
    { path: './files/montserrat-latin-600-normal.woff2', weight: '600', style: 'normal' },
    { path: './files/montserrat-latin-700-normal.woff2', weight: '700', style: 'normal' },
    { path: './files/montserrat-latin-800-normal.woff2', weight: '800', style: 'normal' },
  ],
  variable: '--font-montserrat',
  display: 'swap',
  fallback: ['ui-sans-serif', 'system-ui', 'sans-serif'],
});

export const poppins = localFont({
  src: [
    { path: './files/poppins-latin-400-normal.woff2', weight: '400', style: 'normal' },
    { path: './files/poppins-latin-500-normal.woff2', weight: '500', style: 'normal' },
    { path: './files/poppins-latin-600-normal.woff2', weight: '600', style: 'normal' },
  ],
  variable: '--font-poppins',
  display: 'swap',
  // Body text paints first in the size-adjusted fallback, then swaps without layout shift.
  // Not preloading Poppins keeps ~45 KB off the critical path on Slow 4G (LCP budget, docs/02 §3).
  preload: false,
  fallback: ['ui-sans-serif', 'system-ui', 'sans-serif'],
});
