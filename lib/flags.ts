import { appEnv, type AppEnv } from './env';

/**
 * Feature flags for change requests (docs/11 Part A rule 5, docs/12 §5.3 feature_flags).
 * Change requests ship dark: on for local, preview and staging so ColdEasy can review them,
 * off in production until the change note is approved. Phase 3 moves these to the
 * feature_flags table, where switching one on in production needs a change_note_ref.
 *
 * Override with NEXT_PUBLIC_FEATURE_FLAGS="dark_home,-lang_toggle" (a leading "-" turns one off).
 */
export const FLAGS = {
  dark_home: { changeNote: '11:K4-01 / K4-02 [TBC: change note approval]' },
  lang_toggle: { changeNote: '11:K5-01..K5-05 [TBC: change note approval]' },
  partner_ecosystem: { changeNote: '11:K3-01 [TBC: change note approval]' },
  zoho_sync: { changeNote: 'CR-01 [TBC: change note approval]' },
} as const;

export type FlagKey = keyof typeof FLAGS;

export function resolveFlags(env: AppEnv, override?: string): Record<FlagKey, boolean> {
  const defaultOn = env !== 'production';
  const flags = Object.fromEntries(
    (Object.keys(FLAGS) as FlagKey[]).map((k) => [k, defaultOn]),
  ) as Record<FlagKey, boolean>;
  for (const raw of (override ?? '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)) {
    const off = raw.startsWith('-');
    const key = (off ? raw.slice(1) : raw) as FlagKey;
    if (key in FLAGS) flags[key] = !off;
  }
  return flags;
}

export const flags = resolveFlags(appEnv, process.env.NEXT_PUBLIC_FEATURE_FLAGS);

export function isOn(flag: FlagKey): boolean {
  return flags[flag];
}
