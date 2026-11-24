'use server';

import { signupSchema, type SignupResult } from '@/lib/forms/signup';

/**
 * Top-bar signup (B1-09). Phase 1 validates only: storing the contact and the consent record
 * (docs/05 contacts + consents, with notice_version) arrives with the leads work in Phase 5,
 * behind Turnstile and rate limits. Until then nothing is stored and the form says so.
 */
export async function signupAction(
  _prev: SignupResult | null,
  form: FormData,
): Promise<SignupResult> {
  const parsed = signupSchema.safeParse({
    mobile: String(form.get('mobile') ?? ''),
    consent: form.get('consent') === 'on',
    company: String(form.get('company') ?? ''),
    sourcePage: String(form.get('sourcePage') ?? ''),
  });
  if (!parsed.success) {
    const fields = new Set<'mobile' | 'consent'>();
    for (const issue of parsed.error.issues) {
      if (issue.path[0] === 'mobile' || issue.path[0] === 'consent') fields.add(issue.path[0]);
    }
    if (fields.size === 0) return { ok: false, reason: 'not_live' }; // honeypot: answer like normal
    return { ok: false, reason: 'invalid', fields: [...fields] };
  }
  return { ok: false, reason: 'not_live' };
}
