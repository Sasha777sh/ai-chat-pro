'use client';

import React from 'react';
import { PLAN_CONFIG, ORDERED_PLANS, type PlanId } from '@/lib/plans';
import { VOICE_DEFINITIONS } from '@/lib/voices';
import type { Locale } from '@/lib/i18n';

interface TariffsCardProps {
  lang: Locale;
  onChoose: (planId: PlanId) => void;
}

export default function TariffsCard({ lang, onChoose }: TariffsCardProps) {
  const texts = {
    ru: {
      continue: 'Продолжить диалог?',
      subtitle: 'У вас закончились бесплатные сообщения.',
      perMonth: 'в месяц',
      subscribe: 'Оформить подписку',
      current: 'Текущий план',
    },
    en: {
      continue: 'Continue the conversation?',
      subtitle: 'Your free messages are over.',
      perMonth: 'per month',
      subscribe: 'Subscribe',
      current: 'Current plan',
    },
  };

  const content = texts[lang];

  const getVoicesForPlan = (planId: PlanId) => {
    const plan = PLAN_CONFIG[planId];
    return VOICE_DEFINITIONS.filter((voice) => plan.includedVoices.includes(voice.id));
  };

  return (
    <div className="max-w-7xl mx-auto px-4">
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold mb-4 text-glow-edem">
          {content.continue}
        </h1>
        <p className="text-edem-secondary text-lg">
          {content.subtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {ORDERED_PLANS.map((planId) => {
          const plan = PLAN_CONFIG[planId];
          const voices = getVoicesForPlan(planId);
          const isActive = planId !== 'free';

          return (
            <div
              key={planId}
              className={`card-edem p-6 ${
                plan.highlight
                  ? 'border-edem-live/40 bg-edem-live/10 scale-105 glow-edem'
                  : ''
              }`}
            >
              <div className="mb-4">
                <h3 className="text-2xl font-bold mb-2 text-edem-main">{plan.name}</h3>
                <div className="text-3xl font-bold mb-1 text-edem-main">{plan.priceLabel}</div>
                <div className="text-sm text-edem-muted">{content.perMonth}</div>
              </div>

              <p className="text-edem-secondary mb-6 text-sm">{plan.description}</p>

              <div className="mb-6 space-y-2">
                {voices.map((voice) => {
                  const voiceColors: Record<string, string> = {
                    live: '#4EAEC1',
                    shadow: '#C95B5B',
                    mirror: '#B6A8FF',
                    child: '#A0D17A',
                    sage: '#C1934E',
                  };
                  const accentColor = voiceColors[voice.id] || '#4EAEC1';

                  return (
                    <div key={voice.id} className="text-sm text-edem-secondary flex items-center gap-2">
                      <span style={{ color: accentColor }}>✓</span>
                      <span className="flex items-center gap-1">
                        <span>{voice.emoji}</span>
                        <span>{voice.title}</span>
                      </span>
                    </div>
                  );
                })}
              </div>

              <ul className="mb-6 space-y-2 text-sm text-edem-muted">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span>•</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              {isActive ? (
                <button
                  onClick={() => onChoose(planId)}
                  className="w-full py-3 px-4 bg-edem-live hover:bg-edem-live/80 text-white font-semibold rounded-lg transition-colors glow-edem"
                >
                  {content.subscribe}
                </button>
              ) : (
                <div className="w-full py-3 px-4 bg-edem-surface text-center rounded-lg text-sm font-semibold text-edem-muted">
                  {content.current}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

