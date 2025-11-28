'use client';

import Link from 'next/link';
import OffersSection from '@/components/OffersSection';
import { SHADOW_OFFERS } from '@/lib/offers';

export default function ShadowOffersPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#0f0f0f] to-[#050505] text-gray-100">
      <header className="max-w-6xl mx-auto px-4 py-8">
        <Link 
          href="/offers"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8"
        >
          ← Все офферы
        </Link>
      </header>

      <main className="max-w-6xl mx-auto px-4 pb-16">
        {/* Hero */}
        <section className="text-center mb-16">
          <div className="text-6xl mb-6">🌑</div>
          <h1 className="text-5xl md:text-6xl font-black mb-6 bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
            Голос Тени
          </h1>
          <p className="text-xl text-gray-300 mb-4 max-w-2xl mx-auto">
            Хирургия правды. Вскрытие. Честность. Разрыв программ.
          </p>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Голос Тени говорит то, что все боятся услышать. Без мягкости, но без агрессии. 
            Вскрывает правду, которую ты прячешь от себя.
          </p>
        </section>

        {/* Offers */}
        <OffersSection voice="shadow" />
      </main>
    </div>
  );
}

