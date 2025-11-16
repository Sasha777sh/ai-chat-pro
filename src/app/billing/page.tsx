'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import { PLAN_CONFIG, ORDERED_PLANS, type PlanId } from '@/lib/plans';
import { VOICE_DEFINITIONS } from '@/lib/voices';
import type { SubscriptionTier } from '@/lib/types';

export default function BillingPage() {
  const router = useRouter();
  const [user, setUser] = useState<{ id: string; email?: string } | null>(null);
  const [currentPlan, setCurrentPlan] = useState<SubscriptionTier>('free');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push('/login');
      return;
    }

    setUser(user);

    const { data: profile } = await supabase
      .from('profiles')
      .select('subscription_tier')
      .eq('id', user.id)
      .single();

    if (profile) {
      setCurrentPlan(profile.subscription_tier || 'free');
    }
  };

  const handleCheckout = async (planId: PlanId) => {
    if (planId === 'free') {
      toast.info('Вы уже на бесплатном тарифе');
      return;
    }

    if (!user) {
      toast.error('Войдите для оформления подписки');
      router.push('/login');
      return;
    }

    setLoading(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('Сессия не найдена');
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
      toast.error(error.message || 'Ошибка при оформлении подписки');
    } finally {
      setLoading(false);
    }
  };

  const getVoicesForPlan = (planId: PlanId) => {
    const plan = PLAN_CONFIG[planId];
    return VOICE_DEFINITIONS.filter((voice) => {
      const planOrder = ORDERED_PLANS.indexOf(planId);
      const voiceOrder = ORDERED_PLANS.indexOf(voice.minTier as PlanId);
      return voiceOrder <= planOrder;
    });
  };

  return (
    <div className="min-h-screen bg-edem-dark text-edem-main">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 text-glow-edem">Тарифы</h1>
          <p className="text-edem-secondary text-lg">Выбери план и получи доступ к голосам</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {ORDERED_PLANS.map((planId) => {
            const plan = PLAN_CONFIG[planId];
            const isCurrentPlan = currentPlan === planId;
            const isActivePlan = ['basic', 'plus', 'pro'].includes(planId);
            const voices = getVoicesForPlan(planId);

            return (
              <div
                key={planId}
                className={`card-edem p-6 ${
                  plan.highlight
                    ? 'border-edem-live/40 bg-edem-live/10 scale-105 glow-edem'
                    : ''
                } ${isCurrentPlan ? 'ring-2 ring-edem-live' : ''}`}
              >
                <div className="mb-4">
                  <h3 className="text-2xl font-bold mb-2 text-edem-main">{plan.name}</h3>
                  <div className="text-3xl font-bold mb-1 text-edem-main">{plan.priceLabel}</div>
                  <div className="text-sm text-edem-muted">в месяц</div>
                </div>

                <p className="text-edem-secondary mb-6 text-sm">{plan.description}</p>

                <div className="mb-6 space-y-2">
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

                <ul className="mb-6 space-y-2 text-sm text-edem-muted">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span>•</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                {isCurrentPlan ? (
                  <div className="w-full py-3 px-4 bg-edem-surface text-center rounded-lg text-sm font-semibold text-edem-muted">
                    Текущий план
                  </div>
                ) : (
                  <button
                    onClick={() => handleCheckout(planId)}
                    disabled={loading || !isActivePlan}
                    className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors ${
                      isActivePlan
                        ? 'bg-edem-live hover:bg-edem-live/80 text-white glow-edem'
                        : 'bg-edem-surface text-edem-muted cursor-not-allowed'
                    }`}
                  >
                    {isActivePlan ? 'Оформить подписку' : 'Недоступно'}
                  </button>
                )}
              </div>
            );
          })}
        </div>

        <div className="text-center">
          <Link href="/account" className="text-edem-live hover:text-edem-live/80">
            ← Вернуться в кабинет
          </Link>
        </div>
      </div>
    </div>
  );
}

