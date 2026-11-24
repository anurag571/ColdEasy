/**
 * Locales (docs/11 A6, docs/12 §5.4).
 *
 * Every UI string lives in content/locales/<code>.json under a flat dotted key
 * (`home.hero.title`), matching the K5-05 translation spreadsheet: key, English, one column
 * per language. Only English exists today. A language is routable only when `live` is true,
 * which needs its named reviewer's approval (11:K5-03) and an approved change note
 * (the language toggle is a change request, flag `lang_toggle`).
 */
export const LOCALES = {
  en: { english: 'English', native: 'English', script: 'latin', live: true },
  hi: { english: 'Hindi', native: 'हिन्दी', script: 'devanagari', live: false },
  te: { english: 'Telugu', native: 'తెలుగు', script: 'telugu', live: false },
  kn: { english: 'Kannada', native: 'ಕನ್ನಡ', script: 'kannada', live: false },
  ta: { english: 'Tamil', native: 'தமிழ்', script: 'tamil', live: false },
  mr: { english: 'Marathi', native: 'मराठी', script: 'devanagari', live: false },
  bn: { english: 'Bangla', native: 'বাংলা', script: 'bengali', live: false },
} as const;

export type Locale = keyof typeof LOCALES;
export const DEFAULT_LOCALE: Locale = 'en';

export const ALL_LOCALES = Object.keys(LOCALES) as Locale[];
export const LIVE_LOCALES = ALL_LOCALES.filter((l) => LOCALES[l].live);

export function isLocale(value: string | undefined): value is Locale {
  return !!value && value in LOCALES;
}

export function isLiveLocale(value: string | undefined): value is Locale {
  return isLocale(value) && LOCALES[value].live;
}

/** English lives at the root (`/science`). Other languages get a prefix (`/hi/science`). */
export function localePath(locale: Locale, path: string): string {
  const clean = path.startsWith('/') ? path : `/${path}`;
  if (locale === DEFAULT_LOCALE) return clean;
  return clean === '/' ? `/${locale}` : `/${locale}${clean}`;
}
