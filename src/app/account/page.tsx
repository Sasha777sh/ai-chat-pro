'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';
import type { Profile } from '@/lib/types';
import type { User as SupabaseUser } from '@supabase/supabase-js';

export default function AccountPage() {
  const router = useRouter();
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push('/login');
      return;
    }

    setUser(user);

    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    setProfile(data);
    setLoading(false);
  };

  const handleUpgrade = async (method: 'yookassa' | 'crypto') => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        alert('Необходимо войти в систему');
        return;
      }

      let endpoint = '';
      if (method === 'yookassa') {
        endpoint = '/api/yookassa/checkout';
      } else {
        endpoint = '/api/crypto/checkout';
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ plan: 'month' }),
      });

      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      } else if (data.error) {
        toast.error(`Ошибка: ${data.error}`);
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Неизвестная ошибка';
      toast.error(`Ошибка: ${errorMessage}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-edem-dark">
        <div className="text-edem-secondary">Загрузка...</div>
      </div>
    );
  }

  const isPro = profile?.subscription_tier === 'pro';

  return (
    <div className="min-h-screen bg-edem-dark px-4 py-16">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-edem-main text-glow-edem">Личный кабинет</h1>

        <div className="card-edem mb-8">
          <h2 className="text-2xl font-bold mb-4 text-edem-main">Профиль</h2>
          <div className="space-y-2 text-edem-secondary">
            <p><strong>Email:</strong> {user?.email}</p>
            <p><strong>Тариф:</strong> {profile?.subscription_tier || 'free'}</p>
          </div>
        </div>

        <div className="card-edem mb-8">
          <h2 className="text-2xl font-bold mb-4 text-edem-main">Тариф</h2>
          {isPro ? (
            <div>
              <p className="text-edem-secondary mb-4">У вас активна подписка Pro</p>
              <div className="space-y-2 text-edem-secondary">
                <p>✅ 500 сообщений в месяц</p>
                <p>✅ Полная история чатов</p>
                <p>✅ Приоритетная поддержка</p>
              </div>
            </div>
          ) : (
            <div>
              <p className="text-edem-secondary mb-6">Бесплатный тариф: 2 бесплатных сообщения</p>
              <p className="text-sm text-edem-muted mb-4">Выберите способ оплаты:</p>
              <div className="grid md:grid-cols-2 gap-4">
                <button
                  onClick={() => handleUpgrade('yookassa')}
                  className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-semibold rounded-xl transition-all"
                >
                  🏦 ЮKassa (990₽/мес)
                </button>
                <button
                  onClick={() => handleUpgrade('crypto')}
                  className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold rounded-xl transition-all"
                >
                  ₿ Криптовалюта
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-4 flex-wrap">
          <Link
            href="/chat/live"
            className="px-6 py-3 bg-edem-live hover:bg-edem-live/80 text-white font-semibold rounded-xl transition-colors"
          >
            Вернуться в чат
          </Link>
          <Link
            href="/billing"
            className="px-6 py-3 bg-edem-mirror hover:bg-edem-mirror/80 text-white font-semibold rounded-xl transition-colors"
          >
            Тарифы и оплата
          </Link>
          <button
            onClick={async () => {
              await supabase.auth.signOut();
              router.push('/');
            }}
            className="px-6 py-3 bg-edem-surface hover:bg-edem-surface/80 text-edem-main font-semibold rounded-xl transition-colors border border-edem-line"
          >
            Выйти
          </button>
        </div>
      </div>
    </div>
  );
}

