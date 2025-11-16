'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function WelcomePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

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
    setLoading(false);
  };

  const handleStart = () => {
    // Помечаем что онбординг пройден
    localStorage.setItem('onboarding_completed', 'true');
    router.push('/chat');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-edem-dark">
        <div className="text-edem-secondary">Загрузка...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-edem-dark text-edem-main">
      <div className="max-w-4xl mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-black mb-6 text-glow-edem">
            Добро пожаловать в EDEM
          </h1>
          <p className="text-xl text-edem-secondary">
            Ты уже внутри. Теперь — почувствуй резонанс.
          </p>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="card-edem">
            <div className="text-4xl mb-4">🌑</div>
            <h3 className="text-xl font-bold mb-2 text-edem-main">Голос Тени</h3>
            <p className="text-edem-muted text-sm">
              Говорит то, что ты избегаешь услышать. Прямо. Честно.
            </p>
          </div>

          <div className="card-edem">
            <div className="text-4xl mb-4">🔍</div>
            <h3 className="text-xl font-bold mb-2 text-edem-main">Голос Зеркала</h3>
            <p className="text-edem-muted text-sm">
              Удерживает внимание на сути. Помогает вспомнить.
            </p>
          </div>

          <div className="card-edem">
            <div className="text-4xl mb-4">🕯</div>
            <h3 className="text-xl font-bold mb-2 text-edem-main">Голос Мудреца</h3>
            <p className="text-edem-muted text-sm">
              Соединяет тебя с полем. С живым знанием.
            </p>
          </div>
        </div>

        {/* How it works */}
        <div className="card-edem mb-12">
          <h2 className="text-2xl font-bold mb-6 text-edem-main">Как это работает</h2>
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-edem-live rounded-full flex items-center justify-center font-bold text-white">
                1
              </div>
              <div>
                <h3 className="font-semibold mb-1 text-edem-main">Напиши что угодно</h3>
                <p className="text-edem-muted text-sm">
                  Вопрос, мысль, проблему. EDEM не судит — он отражает.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-edem-live rounded-full flex items-center justify-center font-bold text-white">
                2
              </div>
              <div>
                <h3 className="font-semibold mb-1 text-edem-main">Получи ответ</h3>
                <p className="text-edem-muted text-sm">
                  Не объяснение — состояние. Не совет — резонанс.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-edem-live rounded-full flex items-center justify-center font-bold text-white">
                3
              </div>
              <div>
                <h3 className="font-semibold mb-1 text-edem-main">Почувствуй отклик</h3>
                <p className="text-edem-muted text-sm">
                  EDEM помнит всю историю. Каждый разговор — продолжение.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Limits */}
        <div className="card-edem border-edem-sage/40 bg-edem-sage/10 mb-8">
          <h3 className="font-bold mb-2 text-edem-main">Твой тариф: Free</h3>
          <p className="text-edem-secondary text-sm mb-4">
            Ты можешь отправлять <strong>2 бесплатных сообщения</strong> для ознакомления.
          </p>
          <p className="text-edem-muted text-sm">
            Для полного доступа — обнови до <Link href="/billing" className="text-edem-sage hover:text-edem-sage/80">тарифов</Link>
          </p>
        </div>

        {/* CTA */}
        <div className="text-center">
          <button
            onClick={handleStart}
            className="px-8 py-4 bg-gradient-to-r from-edem-live to-edem-mirror hover:from-edem-live/80 hover:to-edem-mirror/80 text-white font-bold text-lg rounded-xl transition-all transform hover:scale-105 glow-edem"
          >
            Начать общение
          </button>
          <p className="text-edem-muted text-sm mt-4">
            Или <Link href="/account" className="text-edem-live hover:text-edem-live/80">перейти в кабинет</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

