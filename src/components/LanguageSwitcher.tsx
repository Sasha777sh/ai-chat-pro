'use client';

import { useLocale } from '@/contexts/LocaleContext';
import { Globe } from 'lucide-react';

export function LanguageSwitcher() {
  const { locale, setLocale } = useLocale();

  return (
    <div className="flex items-center gap-2">
      <Globe size={18} className="text-edem-secondary" />
      <button
        onClick={() => setLocale(locale === 'ru' ? 'en' : 'ru')}
        className="px-3 py-1.5 rounded-lg border border-edem-line bg-edem-surface hover:bg-edem-secondary-bg text-edem-main text-sm font-medium transition-colors"
        aria-label="Switch language"
      >
        {locale === 'ru' ? 'EN' : 'RU'}
      </button>
    </div>
  );
}

