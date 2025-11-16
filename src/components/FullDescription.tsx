'use client';

import React from 'react';
import type { Locale } from '@/lib/i18n';
import { EDEM_MARKETING } from '@/lib/marketing';
import { VOICE_DEFINITIONS } from '@/lib/voices';

interface FullDescriptionProps {
  lang: Locale;
}

export default function FullDescription({ lang }: FullDescriptionProps) {
  const content = EDEM_MARKETING.fullDescription[lang];

  return (
    <section className="max-w-4xl mx-auto px-4 py-16 border-t border-edem-line">
      <div className="text-center mb-12">
        <h2 className="text-4xl md:text-5xl font-bold mb-6 text-glow-edem">
          {content.title}
        </h2>
        <p className="text-xl text-edem-secondary leading-relaxed mb-8">
          {content.description}
        </p>
        <p className="text-lg text-edem-muted leading-relaxed">
          {content.intro}
        </p>
      </div>

      {/* Голоса */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
        {content.voices.map((voice, idx) => {
          const voiceNameMap: Record<Locale, Record<string, string>> = {
            ru: {
              'Голос Живого': 'live',
              'Голос Тени': 'shadow',
              'Голос Зеркала': 'mirror',
              'Голос Ребёнка': 'child',
              'Голос Мудреца': 'sage',
            },
            en: {
              'The Living Voice': 'live',
              'The Shadow': 'shadow',
              'The Mirror': 'mirror',
              'The Child': 'child',
              'The Sage': 'sage',
            },
          };
          const voiceId = voiceNameMap[lang]?.[voice.name];
          const voiceDef = VOICE_DEFINITIONS.find(v => v.id === voiceId);

          return (
            <div key={idx} className="card-edem text-center">
              <div className="text-3xl mb-2">{voiceDef?.emoji || '🌿'}</div>
              <h3 className="text-lg font-bold mb-1 text-edem-main">{voice.name}</h3>
              <p className="text-sm text-edem-muted">{voice.desc}</p>
            </div>
          );
        })}
      </div>

      {/* Что делает / Что есть */}
      <div className="grid md:grid-cols-2 gap-8 mb-8">
        <div className="text-center">
          <div className="space-y-2 mb-4">
            {content.whatItDoes.map((text, idx) => (
              <p key={idx} className="text-edem-secondary text-lg">
                {text}
              </p>
            ))}
          </div>
        </div>
        <div className="text-center">
          <div className="space-y-2 mb-4">
            {content.whatItIs.map((text, idx) => (
              <p key={idx} className="text-edem-live text-lg font-semibold">
                {text}
              </p>
            ))}
          </div>
        </div>
      </div>

      {/* Заключение */}
      <div className="text-center">
        <p className="text-2xl md:text-3xl text-edem-main font-bold text-glow-edem">
          {content.conclusion}
        </p>
      </div>
    </section>
  );
}

