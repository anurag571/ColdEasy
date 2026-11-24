import { z } from 'zod';

/**
 * Public environment (safe in the browser). Server-only values live in lib/env.server.ts,
 * which imports 'server-only' so a client import fails the build (doc 02 §7, gate 6).
 */
export const APP_ENVS = ['local', 'preview', 'staging', 'production'] as const;
export type AppEnv = (typeof APP_ENVS)[number];

const publicSchema = z.object({
  NEXT_PUBLIC_APP_ENV: z.enum(APP_ENVS).default('local'),
  NEXT_PUBLIC_SITE_URL: z.string().url().default('http://localhost:3000'),
  NEXT_PUBLIC_SUPABASE_URL: z.string().url().optional(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1).optional(),
  NEXT_PUBLIC_GA4_ID: z
    .string()
    .regex(/^G-[A-Z0-9]+$/)
    .optional(),
  NEXT_PUBLIC_RAZORPAY_KEY_ID: z.string().optional(),
  NEXT_PUBLIC_TURNSTILE_SITE_KEY: z.string().optional(),
  NEXT_PUBLIC_SENTRY_DSN: z.string().optional(),
});

// Next.js inlines NEXT_PUBLIC_* only when referenced literally, so list them one by one.
export const publicEnv = publicSchema.parse({
  NEXT_PUBLIC_APP_ENV: process.env.NEXT_PUBLIC_APP_ENV || undefined,
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || undefined,
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || undefined,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || undefined,
  NEXT_PUBLIC_GA4_ID: process.env.NEXT_PUBLIC_GA4_ID || undefined,
  NEXT_PUBLIC_RAZORPAY_KEY_ID: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || undefined,
  NEXT_PUBLIC_TURNSTILE_SITE_KEY: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || undefined,
  NEXT_PUBLIC_SENTRY_DSN: process.env.NEXT_PUBLIC_SENTRY_DSN || undefined,
});

export const appEnv: AppEnv = publicEnv.NEXT_PUBLIC_APP_ENV;
export const isProduction = appEnv === 'production';
/** Staging-only UI (placeholder pills, the design-system page) never renders in production. */
export const showStagingAids = !isProduction;
