-- Обновляем constraint subscription_tier для новых тарифов
ALTER TABLE public.profiles
DROP CONSTRAINT IF EXISTS profiles_subscription_tier_check;

ALTER TABLE public.profiles
ADD CONSTRAINT profiles_subscription_tier_check
CHECK (subscription_tier IN ('free', 'basic', 'plus', 'pro'));

UPDATE public.profiles
SET subscription_tier = 'free'
WHERE subscription_tier NOT IN ('free', 'basic', 'plus', 'pro') OR subscription_tier IS NULL;

-- Добавляем voice_id к chat_sessions
ALTER TABLE public.chat_sessions
ADD COLUMN IF NOT EXISTS voice_id TEXT DEFAULT 'live';

UPDATE public.chat_sessions
SET voice_id = 'live'
WHERE voice_id IS NULL;

ALTER TABLE public.chat_sessions
ALTER COLUMN voice_id SET NOT NULL;

CREATE INDEX IF NOT EXISTS idx_chat_sessions_voice_id
ON public.chat_sessions (voice_id);


