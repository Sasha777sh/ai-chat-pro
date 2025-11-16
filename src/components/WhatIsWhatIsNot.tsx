'use client';

import React from 'react';
import type { Locale } from '@/lib/i18n';
import { EDEM_MARKETING } from '@/lib/marketing';

interface WhatIsWhatIsNotProps {
  lang: Locale;
}

export default function WhatIsWhatIsNot({ lang }: WhatIsWhatIsNotProps) {
  const whatIs = EDEM_MARKETING.whatIs[lang];
  const whatIsNot = EDEM_MARKETING.whatIsNot[lang];

  return (
    <section className="max-w-6xl mx-auto px-4 py-16 border-t border-edem-line">
      <div className="grid md:grid-cols-2 gap-8">
        {/* Что есть */}
        <div className="card-edem">
          <h2 className="text-2xl font-bold mb-6 text-edem-main text-glow-edem">
            {whatIs.title}
          </h2>
          <ul className="space-y-3">
            {whatIs.items.map((item, idx) => (
              <li key={idx} className="flex items-start gap-3 text-edem-secondary">
                <span className="text-edem-live text-xl font-bold flex-shrink-0">✓</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Чего нет */}
        <div className="card-edem border-edem-shadow/20">
          <h2 className="text-2xl font-bold mb-6 text-edem-main text-glow-edem">
            {whatIsNot.title}
          </h2>
          <ul className="space-y-3">
            {whatIsNot.items.map((item, idx) => (
              <li key={idx} className="flex items-start gap-3 text-edem-muted">
                <span className="text-edem-muted text-xl font-bold flex-shrink-0">✗</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

