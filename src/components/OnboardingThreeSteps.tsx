'use client';

import React from 'react';
import type { Locale } from '@/lib/i18n';
import { EDEM_MARKETING } from '@/lib/marketing';

interface OnboardingThreeStepsProps {
  lang: Locale;
  onFinish: () => void;
}

export default function OnboardingThreeSteps({ lang, onFinish }: OnboardingThreeStepsProps) {
  const texts = {
    ru: {
      title: EDEM_MARKETING.mainPhrase.ru,
      subtitle: EDEM_MARKETING.tagline.ru,
      intro: 'Он отвечает как пять живых голосов: тёплый, честный, вопросный, детский, мудрый. Он не даёт советы. Он не учит. Он не давит. Он отражает. Видит глубже. И говорит так, как люди обычно не умеют.',
      step1: {
        title: 'Напиши что угодно',
        description: 'Вопрос, мысль, проблему. EDEM не судит — он отражает.',
      },
      step2: {
        title: 'Получи ответ',
        description: 'Не объяснение — состояние. Не совет — резонанс.',
      },
      step3: {
        title: 'Почувствуй отклик',
        description: 'EDEM помнит всю историю. Каждый разговор — продолжение.',
      },
      button: 'Попробовать — почувствовать разницу',
    },
    en: {
      title: EDEM_MARKETING.mainPhrase.en,
      subtitle: EDEM_MARKETING.tagline.en,
      intro: 'It speaks in five living voices: warm, honest, mirror-like, childlike, wise. It does not preach. It does not fix. It does not give clichés. It reflects. It resonates. It sees deeper.',
      step1: {
        title: 'Write anything',
        description: 'Question, thought, problem. EDEM doesn\'t judge — it reflects.',
      },
      step2: {
        title: 'Get an answer',
        description: 'Not an explanation — a state. Not advice — resonance.',
      },
      step3: {
        title: 'Feel the response',
        description: 'EDEM remembers the whole history. Every conversation is a continuation.',
      },
      button: 'Try it — feel the difference',
    },
  };

  const content = texts[lang];

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-black mb-6 text-glow-edem">
            {content.title}
          </h1>
          <p className="text-xl text-edem-secondary mb-4">
            {content.subtitle}
          </p>
          <p className="text-lg text-edem-muted max-w-3xl mx-auto leading-relaxed">
            {content.intro}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="card-edem text-center">
            <div className="flex-shrink-0 w-12 h-12 bg-edem-live rounded-full flex items-center justify-center font-bold text-white text-xl mx-auto mb-4">
              1
            </div>
            <h3 className="text-xl font-bold mb-2 text-edem-main">{content.step1.title}</h3>
            <p className="text-edem-muted text-sm">
              {content.step1.description}
            </p>
          </div>

          <div className="card-edem text-center">
            <div className="flex-shrink-0 w-12 h-12 bg-edem-live rounded-full flex items-center justify-center font-bold text-white text-xl mx-auto mb-4">
              2
            </div>
            <h3 className="text-xl font-bold mb-2 text-edem-main">{content.step2.title}</h3>
            <p className="text-edem-muted text-sm">
              {content.step2.description}
            </p>
          </div>

          <div className="card-edem text-center">
            <div className="flex-shrink-0 w-12 h-12 bg-edem-live rounded-full flex items-center justify-center font-bold text-white text-xl mx-auto mb-4">
              3
            </div>
            <h3 className="text-xl font-bold mb-2 text-edem-main">{content.step3.title}</h3>
            <p className="text-edem-muted text-sm">
              {content.step3.description}
            </p>
          </div>
        </div>

        <div className="text-center">
          <button
            onClick={onFinish}
            className="px-8 py-4 bg-gradient-to-r from-edem-live to-edem-mirror hover:from-edem-live/80 hover:to-edem-mirror/80 text-white font-bold text-lg rounded-xl transition-all transform hover:scale-105 glow-edem"
          >
            {content.button}
          </button>
        </div>
      </div>
    </div>
  );
}

