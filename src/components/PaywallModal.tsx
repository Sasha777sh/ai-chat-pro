'use client';

import Link from 'next/link';
import { X } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { PLAN_CONFIG, ORDERED_PLANS, type PlanId } from '@/lib/plans';
import { VOICE_DEFINITIONS } from '@/lib/voices';
import type { SubscriptionTier } from '@/lib/types';

interface PaywallModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPlan?: SubscriptionTier;
  onUpgrade?: (planId: PlanId) => void;
}

export default function PaywallModal({ isOpen, onClose, currentPlan = 'free', onUpgrade }: PaywallModalProps) {
  if (!isOpen) return null;

  const handleUpgrade = async (planId: PlanId) => {
    if (planId === 'free') {
      return;
    }

    if (onUpgrade) {
      onUpgrade(planId);
      return;
    }

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        window.location.href = '/login';
        return;
      }

      const response = await fetch('/api/yookassa/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ planId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Ошибка создания сессии оплаты');
      }

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error: any) {
      console.error('Checkout error:', error);
      alert('Ошибка: ' + (error.message || 'Не удалось создать сессию оплаты'));
    }
  };

  const getVoicesForPlan = (planId: PlanId) => {
    const plan = PLAN_CONFIG[planId];
    return VOICE_DEFINITIONS.filter((voice) => plan.includedVoices.includes(voice.id));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="relative w-full max-w-4xl mx-4 bg-edem-surface border border-edem-line rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto inner-shadow-edem">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-edem-muted hover:text-edem-main transition-colors"
        >
          <X size={24} />
        </button>

        <div className="p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-2 text-edem-main text-glow-edem">Продолжить общение?</h2>
            <p className="text-edem-secondary">
              Бесплатный лимит (2 сообщения) исчерпан. Выбери тариф для полного доступа.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {ORDERED_PLANS.filter((planId) => planId !== 'free').map((planId) => {
              const plan = PLAN_CONFIG[planId];
              const voices = getVoicesForPlan(planId);
              const isCurrent = currentPlan === planId;

              return (
                <div
                  key={planId}
                  className={`card-edem p-6 ${
                    plan.highlight
                      ? 'border-edem-live/40 bg-edem-live/10 scale-105 glow-edem'
                      : ''
                  } ${isCurrent ? 'ring-2 ring-edem-live' : ''}`}
                >
                  <div className="mb-4">
                    <h3 className="text-xl font-bold mb-1 text-edem-main">{plan.name}</h3>
                    <div className="text-2xl font-bold mb-1 text-edem-main">{plan.priceLabel}</div>
                    <div className="text-xs text-edem-muted">в месяц</div>
                  </div>

                  <p className="text-edem-secondary mb-4 text-sm">{plan.description}</p>

                  <div className="mb-4 space-y-2">
                    {voices.map((voice) => {
                      const voiceColors: Record<string, string> = {
                        live: '#4EAEC1',
                        shadow: '#C95B5B',
                        mirror: '#B6A8FF',
                        child: '#A0D17A',
                        sage: '#C1934E',
                      };
                      const accentColor = voiceColors[voice.id] || '#4EAEC1';
                      
                      return (
                        <div key={voice.id} className="text-sm text-edem-secondary flex items-center gap-2">
                          <span style={{ color: accentColor }}>✓</span>
                          <span className="flex items-center gap-1">
                            <span>{voice.emoji}</span>
                            <span>{voice.title}</span>
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {isCurrent ? (
                    <div className="w-full py-2 px-4 bg-edem-surface text-center rounded-lg text-sm font-semibold text-edem-muted">
                      Текущий план
                    </div>
                  ) : (
                    <button
                      onClick={() => handleUpgrade(planId)}
                      className="w-full py-2 px-4 bg-edem-live hover:bg-edem-live/80 text-white font-semibold rounded-lg transition-colors"
                    >
                      Оформить подписку
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-8 text-center">
            <Link href="/billing" className="text-edem-live hover:text-edem-live/80 text-sm">
              Посмотреть все тарифы →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

