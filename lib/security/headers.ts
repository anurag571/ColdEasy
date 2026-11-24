/**
 * Security headers and Content Security Policy (docs/07 §3, ticket B1-05 / T-046).
 *
 * One deliberate deviation from doc 07, flagged in the PR:
 * public pages are statically generated, and Next.js App Router hydrates with small inline
 * scripts. A nonce-based CSP would force every page to render per request (no CDN cache).
 * So `script-src` allows 'unsafe-inline' on static pages. Every other directive is as strict
 * as doc 07. Checkout and admin render dynamically anyway; they get a nonce-based policy
 * when they are built (Phase 2/3).
 */

type Header = { key: string; value: string };

export const CSP_SOURCES = {
  razorpayScript: 'https://checkout.razorpay.com',
  razorpayApi: 'https://api.razorpay.com',
  razorpayLumberjack: 'https://lumberjack.razorpay.com',
  gtag: 'https://www.googletagmanager.com',
  ga: 'https://www.google-analytics.com',
  gaRegion: 'https://*.google-analytics.com',
  turnstile: 'https://challenges.cloudflare.com',
  youtube: 'https://www.youtube-nocookie.com',
  supabase: 'https://*.supabase.co',
  supabaseWs: 'wss://*.supabase.co',
  sentry: 'https://*.sentry.io',
  sentryIngest: 'https://*.ingest.sentry.io',
} as const;

export function contentSecurityPolicy({ isDev }: { isDev: boolean }): string {
  const s = CSP_SOURCES;
  const directives: Record<string, string[]> = {
    'default-src': ["'self'"],
    'script-src': [
      "'self'",
      "'unsafe-inline'",
      ...(isDev ? ["'unsafe-eval'"] : []),
      s.razorpayScript,
      s.gtag,
      s.turnstile,
    ],
    'style-src': ["'self'", "'unsafe-inline'"],
    'img-src': ["'self'", 'data:', 'blob:', 'https:'],
    'font-src': ["'self'"],
    'media-src': ["'self'", s.supabase],
    'connect-src': [
      "'self'",
      s.supabase,
      s.supabaseWs,
      s.razorpayApi,
      s.razorpayLumberjack,
      s.ga,
      s.gaRegion,
      s.sentry,
      s.sentryIngest,
      ...(isDev ? ['ws:'] : []),
    ],
    // Instagram embeds were dropped (testimonials use YouTube nocookie, decided 18 Nov 2026).
    'frame-src': [s.razorpayApi, s.razorpayScript, s.turnstile, s.youtube],
    'frame-ancestors': ["'none'"],
    'base-uri': ["'self'"],
    'form-action': ["'self'", s.razorpayApi],
    'object-src': ["'none'"],
    'manifest-src': ["'self'"],
    'worker-src': ["'self'", 'blob:'],
  };
  const policy = Object.entries(directives)
    .map(([k, v]) => `${k} ${v.join(' ')}`)
    .join('; ');
  return policy;
}

export function securityHeaders({ isDev }: { isDev: boolean }): Header[] {
  const headers: Header[] = [
    { key: 'Content-Security-Policy', value: contentSecurityPolicy({ isDev }) },
    { key: 'X-Content-Type-Options', value: 'nosniff' },
    { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
    {
      key: 'Permissions-Policy',
      value:
        'camera=(), microphone=(), geolocation=(), browsing-topics=(), payment=(self "https://checkout.razorpay.com")',
    },
    { key: 'X-Frame-Options', value: 'DENY' },
    // Razorpay checkout opens popups for some banks and UPI apps.
    { key: 'Cross-Origin-Opener-Policy', value: 'same-origin-allow-popups' },
  ];
  if (!isDev) {
    headers.push({
      key: 'Strict-Transport-Security',
      value: 'max-age=63072000; includeSubDomains; preload',
    });
  }
  return headers;
}
