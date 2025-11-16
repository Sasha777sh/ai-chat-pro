# 🗄️ Инструкция для ИИ-агента: SQL-миграция Supabase

## 📋 Задача

Выполнить SQL-миграцию в Supabase для добавления поддержки голосов и биллинга в EDEM Intelligence.

---

## 🎯 Что нужно сделать

### ШАГ 1: Открыть Supabase Dashboard

1. **Открой браузер**
2. **Перейди по адресу:** <https://supabase.com/dashboard>
3. **Войди в аккаунт** (если не авторизован)
4. **Выбери проект** (или создай новый, если его нет)

---

### ШАГ 2: Открыть SQL Editor

1. **В левом меню** найди раздел **"SQL Editor"**
2. **Нажми на "SQL Editor"**
3. Откроется страница с редактором SQL

---

### ШАГ 3: Скопировать SQL-код

**ВАЖНО:** Используй файл `SUPABASE_FULL_MIGRATION.sql` — он содержит ВСЕ миграции в правильном порядке!

1. **Открой файл:** `SUPABASE_FULL_MIGRATION.sql` в проекте
2. **Выдели весь код** (Ctrl+A или Cmd+A)
3. **Скопируй** (Ctrl+C или Cmd+C)

**Этот файл включает:**

- ✅ МИГРАЦИЯ 001: Базовые таблицы (profiles, chat_sessions, chat_messages)
- ✅ МИГРАЦИЯ 002: Админ-доступ (role в profiles)
- ✅ МИГРАЦИЯ 003: Голоса и биллинг (voice_id, billing_subscriptions)

**Или скопируй код ниже (полная миграция):**

```sql
-- ============================================
-- EDEM INTELLIGENCE - Supabase Migration
-- ============================================
-- Скопируй весь код ниже и вставь в Supabase SQL Editor
-- Затем нажми "Run" или Ctrl+Enter
-- ============================================

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

-- ============================================
-- Миграция завершена!
-- ============================================
```

---

### ШАГ 4: Вставить код в SQL Editor

1. **В SQL Editor** нажми в поле ввода (большое текстовое поле)
2. **Вставь скопированный код** (Ctrl+V или Cmd+V)
3. **Проверь**, что весь код вставлен правильно

---

### ШАГ 5: Запустить миграцию

1. **Нажми кнопку "Run"** (в правом верхнем углу SQL Editor)
   - **Или нажми:** Ctrl+Enter (Windows/Linux)
   - **Или нажми:** Cmd+Enter (Mac)

2. **Дождись выполнения** (обычно 1-5 секунд)

3. **Проверь результат:**
   - Должно появиться сообщение: **"Success. No rows returned"** или **"Success"**
   - Если есть ошибки — прочитай их и сообщи

---

## ✅ Что делает миграция

### 1. Добавляет поддержку голосов

- Добавляет колонку `voice_id` в таблицу `chat_sessions`
- Разрешает 5 голосов: `live`, `mirror`, `child`, `shadow`, `sage`
- Устанавливает `live` как значение по умолчанию

### 2. Обновляет тарифы

- Обновляет список допустимых тарифов в `profiles`
- Разрешает: `free`, `basic`, `plus`, `pro`
- Устанавливает `free` для всех существующих пользователей без тарифа

### 3. Создаёт таблицу подписок

- Создаёт таблицу `billing_subscriptions` для хранения подписок
- Поддерживает планы: `basic`, `plus`, `pro`
- Хранит статус, даты окончания, ID подписок

### 4. Настраивает безопасность

- Включает Row Level Security (RLS) для `billing_subscriptions`
- Создаёт политики: пользователи видят и обновляют только свои подписки

### 5. Создаёт триггер

- Автоматически обновляет `updated_at` при изменении подписки

---

## 🔍 Проверка после миграции

### Проверка 1: Таблица chat_sessions

1. В Supabase Dashboard → **Table Editor**
2. Открой таблицу **`chat_sessions`**
3. Проверь, что есть колонка **`voice_id`**
4. Проверь, что значения: `live`, `mirror`, `child`, `shadow`, `sage`

### Проверка 2: Таблица profiles

1. Открой таблицу **`profiles`**
2. Проверь, что колонка **`subscription_tier`** содержит: `free`, `basic`, `plus`, `pro`

### Проверка 3: Таблица billing_subscriptions

1. Открой таблицу **`billing_subscriptions`**
2. Проверь, что таблица создана
3. Проверь, что есть колонки: `id`, `user_id`, `plan`, `status`, `current_period_end`, `created_at`, `updated_at`

---

## ⚠️ Возможные ошибки

### Ошибка: "relation does not exist"

**Причина:** Таблицы `chat_sessions` или `profiles` не существуют  
**Решение:** Сначала выполни базовые миграции (001_init.sql, 002_add_admin.sql)

### Ошибка: "column already exists"

**Причина:** Колонка `voice_id` уже существует  
**Решение:** Это нормально, миграция использует `IF NOT EXISTS`, можно игнорировать

### Ошибка: "permission denied"

**Причина:** Нет прав на изменение таблиц  
**Решение:** Убедись, что используешь правильный проект и есть права администратора

---

## 📝 Отчёт о выполнении

После выполнения миграции напиши:

```
✅ Миграция выполнена успешно

Проверено:
- ✅ Колонка voice_id добавлена в chat_sessions
- ✅ Тарифы обновлены в profiles
- ✅ Таблица billing_subscriptions создана
- ✅ RLS политики настроены
- ✅ Триггер создан

Готово к использованию!
```

---

## 🚀 Следующие шаги

После успешной миграции:

1. **Проверь переменные окружения:**
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`

2. **Протестируй API:**
   - Создай тестового пользователя
   - Попробуй создать сессию чата с голосом
   - Проверь работу биллинга

3. **Готово к деплою!**

---

**Время выполнения:** 1-2 минуты  
**Сложность:** Простая  
**Риск:** Низкий (используется IF NOT EXISTS)
