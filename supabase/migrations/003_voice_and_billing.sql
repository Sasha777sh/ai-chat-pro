-- Добавляем поддержку голосов и биллинга

-- 1. Голоса в chat_sessions
ALTER TABLE public.chat_sessions
ADD COLUMN IF NOT EXISTS voice_id TEXT DEFAULT 'live';

UPDATE public.chat_sessions
SET voice_id = COALESCE(voice_id, 'live');

ALTER TABLE public.chat_sessions
ALTER COLUMN voice_id SET NOT NULL;

ALTER TABLE public.chat_sessions
DROP CONSTRAINT IF EXISTS chat_sessions_voice_id_check;

ALTER TABLE public.chat_sessions
ADD CONSTRAINT chat_sessions_voice_id_check
CHECK (voice_id IN ('live', 'mirror', 'child', 'shadow', 'sage'));

-- 2. Обновляем список допустимых тарифов
ALTER TABLE public.profiles
DROP CONSTRAINT IF EXISTS profiles_subscription_tier_check;

ALTER TABLE public.profiles
ADD CONSTRAINT profiles_subscription_tier_check
CHECK (subscription_tier IN ('free', 'basic', 'plus', 'pro'));

UPDATE public.profiles
SET subscription_tier = 'free'
WHERE subscription_tier IS NULL;

-- 3. Таблица подписок
CREATE TABLE IF NOT EXISTS public.billing_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  plan TEXT NOT NULL CHECK (plan IN ('basic', 'plus', 'pro')),
  status TEXT NOT NULL DEFAULT 'inactive',
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  current_period_end TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS billing_subscriptions_user_id_idx
ON public.billing_subscriptions(user_id);

ALTER TABLE public.billing_subscriptions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own subscriptions" ON public.billing_subscriptions;
DROP POLICY IF EXISTS "Users can update own subscriptions" ON public.billing_subscriptions;

CREATE POLICY "Users can view own subscriptions"
  ON public.billing_subscriptions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own subscriptions"
  ON public.billing_subscriptions FOR UPDATE
  USING (auth.uid() = user_id);

-- 4. Триггер на обновление updated_at
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_billing_subscription_updated_at ON public.billing_subscriptions;
CREATE TRIGGER set_billing_subscription_updated_at
  BEFORE UPDATE ON public.billing_subscriptions
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


