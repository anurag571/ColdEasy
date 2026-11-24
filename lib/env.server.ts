import 'server-only';
import { z } from 'zod';

/** Server-only secrets (doc 02 §7). Never import this file from a 'use client' module. */
const serverSchema = z.object({
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1).optional(),
  RAZORPAY_KEY_SECRET: z.string().min(1).optional(),
  RAZORPAY_WEBHOOK_SECRET: z.string().min(1).optional(),
  TURNSTILE_SECRET_KEY: z.string().min(1).optional(),
  REVALIDATE_SECRET: z.string().min(16).optional(),
  STAGING_BASIC_AUTH: z
    .string()
    .regex(/^[^:]+:.{12,}$/, 'Use user:password with a password of at least 12 characters')
    .optional(),
});

export const serverEnv = serverSchema.parse({
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY || undefined,
  RAZORPAY_KEY_SECRET: process.env.RAZORPAY_KEY_SECRET || undefined,
  RAZORPAY_WEBHOOK_SECRET: process.env.RAZORPAY_WEBHOOK_SECRET || undefined,
  TURNSTILE_SECRET_KEY: process.env.TURNSTILE_SECRET_KEY || undefined,
  REVALIDATE_SECRET: process.env.REVALIDATE_SECRET || undefined,
  STAGING_BASIC_AUTH: process.env.STAGING_BASIC_AUTH || undefined,
});
