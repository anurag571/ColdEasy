'use client';

import { createBrowserClient } from '@supabase/ssr';
import { publicEnv } from '@/lib/env';

/** Browser client with the anon key. Safe by design: RLS decides what it can read. */
export function supabaseBrowser() {
  const url = publicEnv.NEXT_PUBLIC_SUPABASE_URL;
  const key = publicEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key)
    throw new Error('Supabase is not configured (NEXT_PUBLIC_SUPABASE_URL / _ANON_KEY)');
  return createBrowserClient(url, key);
}
