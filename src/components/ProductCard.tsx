'use client';

import Link from 'next/link';
import type { Product } from '@/lib/products';
import { VOICE_DEFINITIONS } from '@/lib/voices';

interface ProductCardProps {
  product: Product;
  compact?: boolean;
}

export default function ProductCard({ product, compact = false }: ProductCardProps) {
  const voiceEmojis = product.voices.map(voiceId => {
    const voice = VOICE_DEFINITIONS.find(v => v.id === voiceId);
    return voice?.emoji || '🌿';
  }).join(' ');

  return (
    <Link 
      href={`/products/${product.id}`}
      className="block group"
    >
      <div className="p-6 rounded-2xl bg-gradient-to-br from-gray-900/50 to-gray-800/50 border border-gray-700/50 backdrop-blur-sm hover:border-amber-500/50 hover:scale-[1.02] transition-all duration-300">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-xl font-black mb-2 bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
              {product.title}
            </h3>
            <p className="text-gray-400 text-sm mb-3">
              {product.description}
            </p>
          </div>
          <div className="text-2xl ml-4">
            {voiceEmojis}
          </div>
        </div>

        {!compact && (
          <>
            <div className="mb-4">
              <p className="text-gray-300 font-medium mb-2">
                {product.offer}
              </p>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              {product.features.slice(0, 3).map((feature, idx) => (
                <span 
                  key={idx}
                  className="px-3 py-1 rounded-full bg-white/5 text-xs text-gray-400"
                >
                  {feature}
                </span>
              ))}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-gray-700/50">
              <div>
                <p className="text-2xl font-black text-amber-400">
                  {product.price} {product.currency === 'RUB' ? '₽' : '$'}
                </p>
                <p className="text-xs text-gray-500">
                  {product.duration}
                </p>
              </div>
              <div className="px-4 py-2 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 text-black font-bold text-sm group-hover:from-amber-300 group-hover:to-orange-400 transition-all">
                Узнать →
              </div>
            </div>
          </>
        )}

        {compact && (
          <div className="flex items-center justify-between pt-4 border-t border-gray-700/50">
            <div>
              <p className="text-xl font-black text-amber-400">
                {product.price} {product.currency === 'RUB' ? '₽' : '$'}
              </p>
              <p className="text-xs text-gray-500">
                {product.duration}
              </p>
            </div>
            <div className="px-4 py-2 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 text-black font-bold text-sm">
              →
            </div>
          </div>
        )}
      </div>
    </Link>
  );
}

