import 'server-only';
import { createClient } from '@supabase/supabase-js';
import { publicEnv } from '@/lib/env';
import { serverEnv } from '@/lib/env.server';

/**
 * Service-role client. Bypasses RLS, so use it only in server routes that validate input
 * first (public form inserts, Razorpay webhook). Never in a Server Component that renders
 * user-controlled data, and never in client code (the 'server-only' import fails that build).
 */
export function supabaseAdmin() {
  const url = publicEnv.NEXT_PUBLIC_SUPABASE_URL;
  const key = serverEnv.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error('Supabase service role is not configured');
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}
