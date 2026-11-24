import en from '@/content/locales/en.json';
import { DEFAULT_LOCALE, type Locale } from './config';

export type Messages = typeof en;
export type MessageKey = keyof Messages;
export type Vars = Record<string, string | number>;

const dictionaries: Partial<Record<Locale, Partial<Messages>>> = { en };

/** Missing keys fall back to English, so a half-translated file never shows a raw key. */
export function getMessages(locale: Locale): Messages {
  const local = dictionaries[locale] ?? {};
  return { ...dictionaries[DEFAULT_LOCALE], ...local } as Messages;
}

export function format(template: string, vars?: Vars): string {
  if (!vars) return template;
  return template.replace(/\{(\w+)\}/g, (match, name: string) =>
    name in vars ? String(vars[name]) : match,
  );
}

export type Translate = (key: MessageKey, vars?: Vars) => string;

export function createTranslator(messages: Messages): Translate {
  return (key, vars) => format(messages[key] ?? key, vars);
}

export function getTranslator(locale: Locale): Translate {
  return createTranslator(getMessages(locale));
}
