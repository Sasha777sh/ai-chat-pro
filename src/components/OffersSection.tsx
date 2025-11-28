'use client';

import { SHADOW_OFFERS, LIVE_OFFERS, MAIN_OFFER } from '@/lib/offers';
import type { Offer } from '@/lib/offers';

interface OffersSectionProps {
  voice: 'shadow' | 'live';
  title?: string;
}

export default function OffersSection({ voice, title }: OffersSectionProps) {
  const offers = voice === 'shadow' ? SHADOW_OFFERS : LIVE_OFFERS;
  const voiceName = voice === 'shadow' ? 'Голос Тени' : 'Голос Живого';
  const voiceEmoji = voice === 'shadow' ? '🌑' : '🌿';
  const gradient = voice === 'shadow' 
    ? 'from-amber-400 to-orange-500' 
    : 'from-emerald-400 to-green-400';

  return (
    <section className="py-16">
      <div className="max-w-6xl mx-auto px-4">
        {title && (
          <h2 className="text-4xl font-black mb-8 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-300 bg-clip-text text-transparent">
            {title}
          </h2>
        )}
        
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl">{voiceEmoji}</span>
            <h3 className={`text-2xl font-black bg-gradient-to-r ${gradient} bg-clip-text text-transparent`}>
              {voiceName}
            </h3>
          </div>
          <p className="text-gray-400 text-lg">
            {voice === 'shadow' 
              ? 'Хирургия правды. Вскрытие. Честность. Разрыв программ.'
              : 'Тепло. Присутствие. Поддержка. Дыхание. Возвращение к себе.'}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {offers.map((offer) => (
            <OfferCard key={offer.id} offer={offer} voice={voice} />
          ))}
        </div>
      </div>
    </section>
  );
}

function OfferCard({ offer, voice }: { offer: Offer; voice: 'shadow' | 'live' }) {
  const gradient = voice === 'shadow' 
    ? 'from-amber-500/10 to-orange-500/10 border-amber-500/20' 
    : 'from-emerald-500/10 to-green-500/10 border-emerald-500/20';

  return (
    <div className={`p-6 rounded-2xl bg-gradient-to-br ${gradient} border backdrop-blur-sm hover:scale-[1.02] transition-transform duration-300`}>
      <p className="text-gray-200 text-lg font-medium leading-relaxed">
        {offer.text}
      </p>
      {offer.category && (
        <span className="inline-block mt-3 px-3 py-1 rounded-full bg-white/5 text-xs text-gray-400">
          {offer.category}
        </span>
      )}
    </div>
  );
}

