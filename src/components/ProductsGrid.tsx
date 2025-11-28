'use client';

import { getAllProducts, getProductsByVoice, getDualVoiceProducts } from '@/lib/products';
import type { VoiceId } from '@/lib/prompts';
import ProductCard from './ProductCard';

interface ProductsGridProps {
  filter?: 'all' | 'shadow' | 'live' | 'both';
  compact?: boolean;
}

export default function ProductsGrid({ filter = 'all', compact = false }: ProductsGridProps) {
  let products = getAllProducts();

  if (filter === 'shadow') {
    products = getProductsByVoice('shadow');
  } else if (filter === 'live') {
    products = getProductsByVoice('live');
  } else if (filter === 'both') {
    products = getDualVoiceProducts();
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400">Продукты не найдены</p>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} compact={compact} />
      ))}
    </div>
  );
}

