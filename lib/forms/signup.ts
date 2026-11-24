import { z } from 'zod';
import { normalizeIndianMobile } from '@/lib/validation';

/** Shared by the signup dialog and the server action, so both validate the same way. */
export const signupSchema = z.object({
  mobile: z
    .string()
    .transform((v) => normalizeIndianMobile(v))
    .refine((v): v is string => v !== null, { message: 'mobile' }),
  consent: z.literal(true, { message: 'consent' }),
  // Honeypot: real people never see or fill this (docs/07 §1).
  company: z.string().max(0).optional(),
  sourcePage: z.string().max(200).optional(),
});

export type SignupResult =
  | { ok: true }
  | { ok: false; reason: 'invalid'; fields: Array<'mobile' | 'consent'> }
  | { ok: false; reason: 'not_live' };
