# 📊 АНАЛИТИКА И EMAIL-ПОСЛЕДОВАТЕЛЬНОСТИ - НАСТРОЙКА

## ✅ ЧТО СДЕЛАНО

### 1. Система аналитики
- ✅ Создан модуль `src/lib/analytics.ts`
- ✅ API endpoint `/api/analytics/track` для сохранения событий
- ✅ Интегрировано в регистрацию, вход, чат
- ✅ Отслеживаются ключевые события:
  - `user_registered` - регистрация
  - `user_logged_in` - вход
  - `chat_message_sent` - отправка сообщения
  - `voice_selected` - выбор голоса
  - `paywall_shown` - показ paywall
  - `subscription_started` - начало подписки

### 2. Email-последовательности
- ✅ Создана структура `src/lib/email-sequences.ts`
- ✅ API endpoint `/api/email/send` для отправки email
- ✅ Шаблоны для:
  - Welcome (день 0)
  - Onboarding день 1 (эмоциональные режимы)
  - Onboarding день 3 (истории пользователей)
  - Onboarding день 7 (специальное предложение)
  - Subscription expiring (напоминание об истечении)

---

## 🔧 ЧТО НУЖНО НАСТРОИТЬ

### 1. Внешние сервисы аналитики (опционально)

#### Mixpanel:
```bash
npm install mixpanel-browser
```

```typescript
// В src/lib/analytics.ts добавить:
import mixpanel from 'mixpanel-browser';

// В методе track():
if (process.env.NEXT_PUBLIC_MIXPANEL_TOKEN) {
  mixpanel.init(process.env.NEXT_PUBLIC_MIXPANEL_TOKEN);
  mixpanel.track(event, properties);
}
```

#### Amplitude:
```bash
npm install @amplitude/analytics-browser
```

```typescript
// В src/lib/analytics.ts добавить:
import * as amplitude from '@amplitude/analytics-browser';

// В методе init():
if (process.env.NEXT_PUBLIC_AMPLITUDE_API_KEY) {
  amplitude.init(process.env.NEXT_PUBLIC_AMPLITUDE_API_KEY);
}
```

### 2. Email-сервис

#### Resend (рекомендуется):
```bash
npm install resend
```

```typescript
// В src/app/api/email/send/route.ts:
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

await resend.emails.send({
  from: 'EDEM <noreply@chatedem.com>',
  to: [to],
  subject: sequence.template.subject,
  html: sequence.template.html,
  text: sequence.template.text,
});
```

#### SendGrid:
```bash
npm install @sendgrid/mail
```

#### Postmark:
```bash
npm install postmark
```

### 3. Сохранение аналитики в БД (опционально)

Создай таблицу в Supabase:

```sql
CREATE TABLE IF NOT EXISTS public.analytics_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event TEXT NOT NULL,
  properties JSONB,
  user_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_analytics_events_user_id ON public.analytics_events(user_id);
CREATE INDEX idx_analytics_events_event ON public.analytics_events(event);
CREATE INDEX idx_analytics_events_created_at ON public.analytics_events(created_at);
```

Затем в `src/app/api/analytics/track/route.ts` раскомментируй код сохранения.

---

## 📋 ПЕРЕМЕННЫЕ ОКРУЖЕНИЯ

Добавь в Vercel:

```bash
# Аналитика (опционально)
NEXT_PUBLIC_ANALYTICS_ENABLED=true
NEXT_PUBLIC_MIXPANEL_TOKEN=xxx  # если используешь Mixpanel
NEXT_PUBLIC_AMPLITUDE_API_KEY=xxx  # если используешь Amplitude

# Email (обязательно для отправки)
RESEND_API_KEY=re_xxx  # если используешь Resend
SENDGRID_API_KEY=SG.xxx  # если используешь SendGrid
POSTMARK_API_KEY=xxx  # если используешь Postmark
```

---

## 🚀 ИСПОЛЬЗОВАНИЕ

### Аналитика:

```typescript
import { analytics, trackRegistration, trackLogin } from '@/lib/analytics';

// Инициализация
analytics.init(userId);

// Отслеживание событий
trackRegistration(email);
trackLogin(email);
analytics.track('custom_event', { property: 'value' });
```

### Email:

```typescript
// Отправка email через API
await fetch('/api/email/send', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    type: 'welcome',
    to: 'user@example.com',
  }),
});
```

---

## ✅ СТАТУС

- ✅ Базовая структура готова
- ✅ Интеграция в ключевые места
- ⏳ Внешние сервисы (Mixpanel/Amplitude) - опционально
- ⏳ Email-сервис (Resend/SendGrid) - нужно настроить для отправки

**Всё готово для интеграции внешних сервисов! 🎯**

