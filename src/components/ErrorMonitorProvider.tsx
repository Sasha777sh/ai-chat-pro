'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { errorMonitor } from '@/lib/error-monitoring';

/**
 * Провайдер для инициализации мониторинга ошибок
 */
export function ErrorMonitorProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    // Инициализируем мониторинг ошибок
    errorMonitor.init();

    // Подписываемся на изменения сессии для обновления userId
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        errorMonitor.setUser(session.user.id, {
          email: session.user.email,
        });
      } else {
        errorMonitor.reset();
      }
    });

    return () => {
      subscription.unsubscribe();
      errorMonitor.reset();
    };
  }, []);

  return <>{children}</>;
}

