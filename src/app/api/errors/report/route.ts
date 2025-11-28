import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

/**
 * API endpoint для сохранения ошибок
 * В будущем можно интегрировать с Sentry, LogRocket и т.д.
 */

export async function POST(request: Request) {
  try {
    // Проверяем, включен ли мониторинг
    if (process.env.NEXT_PUBLIC_ERROR_MONITORING_ENABLED !== 'true' && process.env.NODE_ENV !== 'production') {
      return NextResponse.json({ success: true, message: 'Error monitoring disabled' });
    }

    const errorData = await request.json();
    const { message, stack, name, context } = errorData;

    if (!message) {
      return NextResponse.json({ error: 'Error message is required' }, { status: 400 });
    }

    // Логируем ошибку
    console.error('[Error Report]', {
      message,
      name,
      stack: stack?.substring(0, 500), // Ограничиваем длину стека
      context,
      timestamp: new Date().toISOString(),
    });

    // В будущем можно сохранять в Supabase таблицу error_logs
    // Или отправлять в Sentry через их API

    // Пример сохранения в Supabase (раскомментировать когда будет готова таблица):
    /*
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (supabaseUrl && serviceRoleKey) {
      const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);
      
      await supabaseAdmin.from('error_logs').insert({
        message,
        stack: stack?.substring(0, 2000), // Ограничиваем длину
        name,
        context: context || {},
        user_id: context?.userId || null,
        url: context?.url || null,
        user_agent: context?.userAgent || null,
        created_at: new Date().toISOString(),
      });
    }
    */

    // Пример отправки в Sentry (раскомментировать когда будет настроен):
    /*
    if (process.env.SENTRY_DSN) {
      const Sentry = require('@sentry/nextjs');
      Sentry.captureException(new Error(message), {
        extra: context,
        tags: {
          component: context?.component || 'unknown',
        },
      });
    }
    */

    return NextResponse.json({ success: true });
  } catch (error) {
    // Не блокируем выполнение при ошибке мониторинга
    console.error('[Error Report] Failed to process error report:', error);
    return NextResponse.json({ success: false, error: 'Failed to process error report' }, { status: 500 });
  }
}

