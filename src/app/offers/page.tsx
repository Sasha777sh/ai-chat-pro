'use client';

import Link from 'next/link';
import { MAIN_OFFER, LANDING_OFFERS } from '@/lib/offers';
import OffersSection from '@/components/OffersSection';

export default function OffersPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#0f0f0f] to-[#050505] text-gray-100">
      {/* Header */}
      <header className="max-w-6xl mx-auto px-4 py-8">
        <Link 
          href="/"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8"
        >
          ← На главную
        </Link>
      </header>

      <main className="max-w-6xl mx-auto px-4 pb-16">
        {/* Hero */}
        <section className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-black mb-6 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-300 bg-clip-text text-transparent">
            {MAIN_OFFER.title}
          </h1>
          <p className="text-2xl text-gray-300 mb-4">
            {MAIN_OFFER.subtitle}
          </p>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            {MAIN_OFFER.description}
          </p>
        </section>

        {/* Landing Offers */}
        <section className="mb-16">
          <h2 className="text-3xl font-black mb-8 text-center bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
            Офферы EDEM
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {LANDING_OFFERS.map((offer, idx) => (
              <div 
                key={idx}
                className="p-6 rounded-2xl bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/20 backdrop-blur-sm"
              >
                <p className="text-gray-200 text-lg font-medium leading-relaxed">
                  {offer}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Shadow Offers */}
        <OffersSection voice="shadow" title="Офферы под Голос Тени" />

        {/* Live Offers */}
        <OffersSection voice="live" title="Офферы под Голос Живого" />
      </main>
    </div>
  );
}

