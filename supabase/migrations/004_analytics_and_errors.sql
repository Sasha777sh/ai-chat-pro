-- ============================================
-- МИГРАЦИЯ 004: Аналитика и логирование ошибок
-- ============================================

-- Таблица для аналитических событий
CREATE TABLE IF NOT EXISTS public.analytics_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event TEXT NOT NULL,
  properties JSONB,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Индексы для производительности
CREATE INDEX IF NOT EXISTS idx_analytics_events_user_id ON public.analytics_events(user_id);
CREATE INDEX IF NOT EXISTS idx_analytics_events_event ON public.analytics_events(event);
CREATE INDEX IF NOT EXISTS idx_analytics_events_created_at ON public.analytics_events(created_at);

-- RLS для analytics_events
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;

-- Политики для analytics_events
-- Пользователи могут видеть только свои события
CREATE POLICY "Users can view own analytics events"
  ON public.analytics_events FOR SELECT
  USING (auth.uid() = user_id);

-- Пользователи могут создавать свои события
CREATE POLICY "Users can insert own analytics events"
  ON public.analytics_events FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Таблица для логов ошибок
CREATE TABLE IF NOT EXISTS public.error_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  message TEXT NOT NULL,
  stack TEXT,
  name TEXT,
  context JSONB,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  url TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Индексы для производительности
CREATE INDEX IF NOT EXISTS idx_error_logs_user_id ON public.error_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_error_logs_created_at ON public.error_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_error_logs_name ON public.error_logs(name);

-- RLS для error_logs
ALTER TABLE public.error_logs ENABLE ROW LEVEL SECURITY;

-- Политики для error_logs
-- Пользователи могут видеть только свои ошибки
CREATE POLICY "Users can view own error logs"
  ON public.error_logs FOR SELECT
  USING (auth.uid() = user_id);

-- Пользователи могут создавать свои логи ошибок
CREATE POLICY "Users can insert own error logs"
  ON public.error_logs FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Комментарии к таблицам
COMMENT ON TABLE public.analytics_events IS 'Аналитические события для отслеживания поведения пользователей';
COMMENT ON TABLE public.error_logs IS 'Логи ошибок для мониторинга и отладки';

COMMENT ON COLUMN public.analytics_events.event IS 'Тип события (user_registered, chat_message_sent и т.д.)';
COMMENT ON COLUMN public.analytics_events.properties IS 'Дополнительные свойства события в формате JSON';
COMMENT ON COLUMN public.error_logs.message IS 'Текст ошибки';
COMMENT ON COLUMN public.error_logs.stack IS 'Стек вызовов ошибки';
COMMENT ON COLUMN public.error_logs.context IS 'Контекст ошибки (компонент, URL и т.д.)';

