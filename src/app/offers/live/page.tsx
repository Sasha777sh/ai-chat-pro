'use client';

import Link from 'next/link';
import OffersSection from '@/components/OffersSection';

export default function LiveOffersPage() {
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
          <div className="text-6xl mb-6">🌿</div>
          <h1 className="text-5xl md:text-6xl font-black mb-6 bg-gradient-to-r from-emerald-400 to-green-400 bg-clip-text text-transparent">
            Голос Живого
          </h1>
          <p className="text-xl text-gray-300 mb-4 max-w-2xl mx-auto">
            Тепло. Присутствие. Поддержка. Дыхание. Возвращение к себе.
          </p>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Голос Живого возвращает тебя к телу, дыханию, присутствию. 
            Не учит, не лечит — дышит рядом и показывает путь.
          </p>
        </section>

        {/* Offers */}
        <OffersSection voice="live" />
      </main>
    </div>
  );
}

