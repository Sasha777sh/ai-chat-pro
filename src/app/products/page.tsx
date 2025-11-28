'use client';

import { useState } from 'react';
import Link from 'next/link';
import ProductsGrid from '@/components/ProductsGrid';

export default function ProductsPage() {
  const [filter, setFilter] = useState<'all' | 'shadow' | 'live' | 'both'>('all');

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#0f0f0f] to-[#050505] text-gray-100">
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
        <section className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-black mb-6 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-300 bg-clip-text text-transparent">
            Продукты EDEM
          </h1>
          <p className="text-xl text-gray-300 mb-4 max-w-2xl mx-auto">
            Система продуктов на основе двух голосов: Тень и Живое
          </p>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Каждый продукт использует один или оба голоса для глубокой работы с собой
          </p>
        </section>

        {/* Filters */}
        <section className="mb-8">
          <div className="flex flex-wrap gap-3 justify-center">
            <button
              onClick={() => setFilter('all')}
              className={`px-6 py-3 rounded-full font-semibold transition-all ${
                filter === 'all'
                  ? 'bg-gradient-to-r from-amber-400 to-orange-500 text-black'
                  : 'bg-white/5 text-gray-400 hover:bg-white/10'
              }`}
            >
              Все
            </button>
            <button
              onClick={() => setFilter('both')}
              className={`px-6 py-3 rounded-full font-semibold transition-all ${
                filter === 'both'
                  ? 'bg-gradient-to-r from-amber-400 to-orange-500 text-black'
                  : 'bg-white/5 text-gray-400 hover:bg-white/10'
              }`}
            >
              Оба голоса
            </button>
            <button
              onClick={() => setFilter('shadow')}
              className={`px-6 py-3 rounded-full font-semibold transition-all ${
                filter === 'shadow'
                  ? 'bg-gradient-to-r from-amber-400 to-orange-500 text-black'
                  : 'bg-white/5 text-gray-400 hover:bg-white/10'
              }`}
            >
              🌑 Тень
            </button>
            <button
              onClick={() => setFilter('live')}
              className={`px-6 py-3 rounded-full font-semibold transition-all ${
                filter === 'live'
                  ? 'bg-gradient-to-r from-amber-400 to-orange-500 text-black'
                  : 'bg-white/5 text-gray-400 hover:bg-white/10'
              }`}
            >
              🌿 Живое
            </button>
          </div>
        </section>

        {/* Products Grid */}
        <ProductsGrid filter={filter} />
      </main>
    </div>
  );
}

