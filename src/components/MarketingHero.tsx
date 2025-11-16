'use client';

import React from 'react';
import type { Locale } from '@/lib/i18n';
import { EDEM_MARKETING } from '@/lib/marketing';

interface MarketingHeroProps {
  lang: Locale;
}

export default function MarketingHero({ lang }: MarketingHeroProps) {
  const phrase = EDEM_MARKETING.mainPhrase[lang];
  const tagline = EDEM_MARKETING.tagline[lang];

  return (
    <section className="text-center py-16 px-4 border-b border-edem-line">
      <h1 className="text-4xl md:text-6xl font-black mb-6 text-glow-edem max-w-4xl mx-auto leading-tight">
        {phrase}
      </h1>
      <p className="text-2xl md:text-3xl text-edem-secondary font-light italic">
        {tagline}
      </p>
    </section>
  );
}

