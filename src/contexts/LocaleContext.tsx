'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Locale } from '@/lib/i18n';

interface LocaleContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
}

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('ru');

  useEffect(() => {
    // Загружаем сохранённую локаль из localStorage
    const saved = localStorage.getItem('locale') as Locale;
    if (saved && (saved === 'ru' || saved === 'en')) {
      setLocaleState(saved);
    } else {
      // Определяем локаль по браузеру
      const browserLang = navigator.language.split('-')[0];
      setLocaleState(browserLang === 'en' ? 'en' : 'ru');
    }
  }, []);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem('locale', newLocale);
    // Обновляем lang атрибут html
    document.documentElement.lang = newLocale;
  };

  return (
    <LocaleContext.Provider value={{ locale, setLocale }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error('useLocale must be used within LocaleProvider');
  }
  return context;
}

