import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

/**
 * API endpoint для сохранения аналитических событий
 * В будущем можно интегрировать с Mixpanel, Amplitude и т.д.
 */

export async function POST(request: Request) {
  try {
    // Проверяем, включена ли аналитика
    if (process.env.NEXT_PUBLIC_ANALYTICS_ENABLED !== 'true' && process.env.NODE_ENV !== 'production') {
      return NextResponse.json({ success: true, message: 'Analytics disabled' });
    }

    const eventData = await request.json();
    const { event, properties } = eventData;

    if (!event) {
      return NextResponse.json({ error: 'Event is required' }, { status: 400 });
    }

    // Логируем событие (в продакшене можно сохранять в БД или отправлять во внешние сервисы)
    console.log('[Analytics Event]', {
      event,
      properties,
      timestamp: new Date().toISOString(),
    });

    // В будущем можно сохранять в Supabase таблицу analytics_events
    // Или отправлять в Mixpanel/Amplitude через их API

    // Пример сохранения в Supabase (раскомментировать когда будет готова таблица):
    /*
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (supabaseUrl && serviceRoleKey) {
      const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);
      
      await supabaseAdmin.from('analytics_events').insert({
        event,
        properties,
        user_id: properties?.userId || null,
        created_at: new Date().toISOString(),
      });
    }
    */

    return NextResponse.json({ success: true });
  } catch (error) {
    // Не блокируем выполнение при ошибке аналитики
    console.error('[Analytics] Error tracking event:', error);
    return NextResponse.json({ success: false, error: 'Failed to track event' }, { status: 500 });
  }
}

