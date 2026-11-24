import React, { createContext, useContext, useEffect, useState } from 'react';
import en from '../locales/en.json';
import hi from '../locales/hi.json';
import te from '../locales/te.json';
import kn from '../locales/kn.json';
import ta from '../locales/ta.json';
import mr from '../locales/mr.json';
import bn from '../locales/bn.json';

export const LANGUAGES = [
  { id: 'en', label: 'English', htmlLang: 'en', script: null },
  { id: 'hi', label: 'हिन्दी', htmlLang: 'hi', script: 'devanagari' },
  { id: 'te', label: 'తెలుగు', htmlLang: 'te', script: 'telugu' },
  { id: 'kn', label: 'ಕನ್ನಡ', htmlLang: 'kn', script: 'kannada' },
  { id: 'ta', label: 'தமிழ்', htmlLang: 'ta', script: 'tamil' },
  { id: 'mr', label: 'मराठी', htmlLang: 'mr', script: 'devanagari' },
  { id: 'bn', label: 'বাংলা', htmlLang: 'bn', script: 'bengali' },
] as const;

export type Language = (typeof LANGUAGES)[number]['id'];

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, vars?: Record<string, string | number>) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const STORAGE_KEY = 'coldeasy_lang';
const PENDING = '[TRANSLATION PENDING]';

const CATALOGUES: Record<Language, Record<string, string>> = {
  en,
  hi,
  te,
  kn,
  ta,
  mr,
  bn,
};

const loadedScripts = new Set<string>();

function isLanguage(value: string | null): value is Language {
  return LANGUAGES.some((item) => item.id === value);
}

function applyDocumentLanguage(lang: Language) {
  const item = LANGUAGES.find((entry) => entry.id === lang) ?? LANGUAGES[0];
  document.documentElement.lang = item.htmlLang;
  if (item.script) {
    document.documentElement.dataset.script = item.script;
  } else {
    delete document.documentElement.dataset.script;
  }
}

async function loadScriptFont(script: string) {
  if (loadedScripts.has(script)) return;
  loadedScripts.add(script);
  if (script === 'devanagari') {
    await Promise.all([
      import('@fontsource/noto-sans-devanagari/400.css'),
      import('@fontsource/noto-sans-devanagari/700.css'),
    ]);
  } else if (script === 'telugu') {
    await Promise.all([
      import('@fontsource/noto-sans-telugu/400.css'),
      import('@fontsource/noto-sans-telugu/700.css'),
    ]);
  } else if (script === 'kannada') {
    await Promise.all([
      import('@fontsource/noto-sans-kannada/400.css'),
      import('@fontsource/noto-sans-kannada/700.css'),
    ]);
  } else if (script === 'tamil') {
    await Promise.all([
      import('@fontsource/noto-sans-tamil/400.css'),
      import('@fontsource/noto-sans-tamil/700.css'),
    ]);
  } else if (script === 'bengali') {
    await Promise.all([
      import('@fontsource/noto-sans-bengali/400.css'),
      import('@fontsource/noto-sans-bengali/700.css'),
    ]);
  }
}

function readStoredLanguage(): Language {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (isLanguage(saved)) return saved;
  } catch {
    // ignore
  }
  return 'en';
}

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const initial = readStoredLanguage();
    applyDocumentLanguage(initial);
    return initial;
  });

  useEffect(() => {
    applyDocumentLanguage(language);
    const script = LANGUAGES.find((item) => item.id === language)?.script;
    if (script) {
      void loadScriptFont(script);
    }
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      // ignore
    }
  };

  const t = (key: string, vars?: Record<string, string | number>): string => {
    const local = CATALOGUES[language]?.[key];
    const english = CATALOGUES.en[key];
    const raw = local && local !== PENDING ? local : english || key;
    if (!vars) return raw;
    return Object.entries(vars).reduce(
      (text, [name, value]) => text.replaceAll(`{${name}}`, String(value)),
      raw,
    );
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
