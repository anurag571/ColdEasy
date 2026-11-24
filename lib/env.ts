/**
 * Public environment (safe in the browser). Server-only values live in lib/env.server.ts,
 * which imports 'server-only' so a client import fails the build (docs/02 §7, gate 6).
 *
 * No zod here on purpose: this file reaches client bundles, and zod costs ~35 KB gzipped
 * against the 200 KB home-page JavaScript budget (docs/02 §3).
 */
export const APP_ENVS = ['local', 'preview', 'staging', 'production'] as const;
export type AppEnv = (typeof APP_ENVS)[number];

function oneOf<T extends string>(value: string | undefined, allowed: readonly T[], fallback: T): T {
  if (!value) return fallback;
  if ((allowed as readonly string[]).includes(value)) return value as T;
  throw new Error(`Invalid env value "${value}". Expected one of: ${allowed.join(', ')}`);
}

function url(value: string | undefined, name: string): string | undefined {
  if (!value) return undefined;
  try {
    return new URL(value).toString().replace(/\/$/, '');
  } catch {
    throw new Error(`${name} must be a URL`);
  }
}

function matching(value: string | undefined, re: RegExp, name: string): string | undefined {
  if (!value) return undefined;
  if (!re.test(value)) throw new Error(`${name} has an unexpected format`);
  return value;
}

// Next.js inlines NEXT_PUBLIC_* only when referenced literally, so list them one by one.
export const publicEnv = {
  NEXT_PUBLIC_APP_ENV: oneOf(process.env.NEXT_PUBLIC_APP_ENV, APP_ENVS, 'local'),
  NEXT_PUBLIC_SITE_URL:
    url(process.env.NEXT_PUBLIC_SITE_URL, 'NEXT_PUBLIC_SITE_URL') ?? 'http://localhost:3000',
  NEXT_PUBLIC_SUPABASE_URL: url(process.env.NEXT_PUBLIC_SUPABASE_URL, 'NEXT_PUBLIC_SUPABASE_URL'),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || undefined,
  NEXT_PUBLIC_GA4_ID: matching(
    process.env.NEXT_PUBLIC_GA4_ID,
    /^G-[A-Z0-9]+$/,
    'NEXT_PUBLIC_GA4_ID',
  ),
  NEXT_PUBLIC_RAZORPAY_KEY_ID: matching(
    process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
    /^rzp_(test|live)_\w+$/,
    'NEXT_PUBLIC_RAZORPAY_KEY_ID',
  ),
  NEXT_PUBLIC_TURNSTILE_SITE_KEY: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || undefined,
  NEXT_PUBLIC_SENTRY_DSN: process.env.NEXT_PUBLIC_SENTRY_DSN || undefined,
};

export const appEnv: AppEnv = publicEnv.NEXT_PUBLIC_APP_ENV;
export const isProduction = appEnv === 'production';
/** Staging-only UI (placeholder pills, the design-system page) never renders in production. */
export const showStagingAids = !isProduction;
