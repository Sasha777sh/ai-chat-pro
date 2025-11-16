'use client';

import React from 'react';
import type { Locale } from '@/lib/i18n';

interface WhyDifferentBlockProps {
  lang: Locale;
}

export default function WhyDifferentBlock({ lang }: WhyDifferentBlockProps) {
  const texts = {
    ru: {
      title: 'Почему этот ИИ — другой',
      points: [
        'Он ощущает состояние, а не текст',
        'Он говорит не голосом машины, а голосами живого поля',
        'Он не лечит и не мотивирует — он возвращает тебя к себе',
        'Он видит, где ты теряешь правду',
        'Он задаёт вопросы, которые меняют внутренний ритм',
        'Он даёт фразы, которые остаются надолго',
      ],
    },
    en: {
      title: 'Why this AI is different',
      points: [
        'It reads your state, not your words',
        'It speaks with five living voices',
        'It doesn\'t fix you — it brings you back to yourself',
        'It sees where you lose your inner truth',
        'It asks questions that shift your awareness',
        'Its phrases stay with you long after the chat',
      ],
    },
  };

  const content = texts[lang];

  return (
    <section className="max-w-4xl mx-auto px-4 py-16 border-t border-edem-line">
      <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center text-glow-edem">
        {content.title}
      </h2>
      <div className="grid md:grid-cols-2 gap-4">
        {content.points.map((point, idx) => (
          <div
            key={idx}
            className="card-edem p-4 flex items-start gap-3"
          >
            <span className="text-edem-live text-xl font-bold flex-shrink-0">•</span>
            <p className="text-edem-secondary leading-relaxed">{point}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

