'use client';

import { use } from 'react';
import Link from 'next/link';
import { getProduct, type ProductId } from '@/lib/products';
import { VOICE_DEFINITIONS } from '@/lib/voices';

interface ProductPageProps {
  params: Promise<{ productId: ProductId }>;
}

export default function ProductPage({ params }: ProductPageProps) {
  const { productId } = use(params);
  const product = getProduct(productId);

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#0f0f0f] to-[#050505] text-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-black mb-4">Продукт не найден</h1>
          <Link href="/products" className="text-amber-400 hover:text-amber-300">
            ← Вернуться к продуктам
          </Link>
        </div>
      </div>
    );
  }

  const voiceEmojis = product.voices.map(voiceId => {
    const voice = VOICE_DEFINITIONS.find(v => v.id === voiceId);
    return { emoji: voice?.emoji || '🌿', name: voice?.title || voiceId };
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#0f0f0f] to-[#050505] text-gray-100">
      <header className="max-w-4xl mx-auto px-4 py-8">
        <Link 
          href="/products"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8"
        >
          ← Все продукты
        </Link>
      </header>

      <main className="max-w-4xl mx-auto px-4 pb-16">
        {/* Hero */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            {voiceEmojis.map((v, idx) => (
              <span key={idx} className="text-4xl">{v.emoji}</span>
            ))}
          </div>
          <h1 className="text-4xl md:text-5xl font-black mb-4 bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
            {product.title}
          </h1>
          <p className="text-xl text-gray-300 mb-6">
            {product.description}
          </p>
          <div className="p-6 rounded-2xl bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/20">
            <p className="text-2xl font-bold text-gray-200">
              {product.offer}
            </p>
          </div>
        </section>

        {/* Details */}
        <section className="mb-12">
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div>
              <h3 className="text-lg font-bold mb-3 text-gray-300">Голоса</h3>
              <div className="flex flex-wrap gap-2">
                {voiceEmojis.map((v, idx) => (
                  <span 
                    key={idx}
                    className="px-4 py-2 rounded-full bg-white/5 text-sm"
                  >
                    {v.emoji} {v.name}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-3 text-gray-300">Длительность</h3>
              <p className="text-gray-400">{product.duration}</p>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-lg font-bold mb-3 text-gray-300">Как это работает</h3>
            <p className="text-gray-400 leading-relaxed">
              {product.howItWorks}
            </p>
          </div>

          <div className="mb-8">
            <h3 className="text-lg font-bold mb-3 text-gray-300">Для кого</h3>
            <p className="text-gray-400 leading-relaxed">
              {product.forWhom}
            </p>
          </div>

          <div className="mb-8">
            <h3 className="text-lg font-bold mb-3 text-gray-300">Результат</h3>
            <p className="text-gray-400 leading-relaxed">
              {product.result}
            </p>
          </div>
        </section>

        {/* Features */}
        <section className="mb-12">
          <h3 className="text-lg font-bold mb-4 text-gray-300">Что включено</h3>
          <div className="grid md:grid-cols-2 gap-4">
            {product.features.map((feature, idx) => (
              <div 
                key={idx}
                className="p-4 rounded-xl bg-white/5 border border-gray-700/50"
              >
                <p className="text-gray-300">{feature}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="text-center">
          <div className="p-8 rounded-2xl bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/20">
            <p className="text-4xl font-black mb-4 text-amber-400">
              {product.price} {product.currency === 'RUB' ? '₽' : '$'}
            </p>
            <p className="text-gray-400 mb-6">{product.duration}</p>
            <Link
              href={`/chat/${product.voices[0]}?mode=${product.mode}`}
              className="inline-block px-8 py-4 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 text-black font-bold hover:from-amber-300 hover:to-orange-400 transition-all shadow-lg shadow-amber-500/30 hover:shadow-amber-500/50 hover:scale-105"
            >
              Начать сессию →
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}

