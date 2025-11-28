# 🛡️ МОНИТОРИНГ ОШИБОК И МОДЕРАЦИЯ КОНТЕНТА

## ✅ ЧТО СДЕЛАНО

### 1. Система мониторинга ошибок
- ✅ Создан модуль `src/lib/error-monitoring.ts`
- ✅ API endpoint `/api/errors/report` для сохранения ошибок
- ✅ Автоматический перехват необработанных ошибок
- ✅ Перехват необработанных промисов
- ✅ Компонент `ErrorMonitorProvider` для инициализации

### 2. Модерация контента
- ✅ Создан модуль `src/lib/content-moderation.ts`
- ✅ Интегрировано в API чата (`/api/chat/stream`)
- ✅ Фильтры для:
  - Самоубийство/самоповреждение (высокий приоритет)
  - Насилие (высокий приоритет)
  - Незаконные вещества (средний приоритет)
  - Спам (повторяющиеся символы)
  - Слишком длинные/короткие сообщения

---

## 🔧 ЧТО НУЖНО НАСТРОИТЬ

### 1. Интеграция ErrorMonitorProvider

Добавь в `src/app/layout.tsx`:

```tsx
import { ErrorMonitorProvider } from '@/components/ErrorMonitorProvider';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        <ErrorMonitorProvider>
          {children}
        </ErrorMonitorProvider>
      </body>
    </html>
  );
}
```

### 2. Внешние сервисы мониторинга (опционально)

#### Sentry:
```bash
npm install @sentry/nextjs
```

```typescript
// В src/lib/error-monitoring.ts добавить:
import * as Sentry from '@sentry/nextjs';

// В методе captureError():
if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
  Sentry.captureException(error, { extra: context });
}
```

#### LogRocket:
```bash
npm install logrocket
```

### 3. Сохранение ошибок в БД (опционально)

Создай таблицу в Supabase:

```sql
CREATE TABLE IF NOT EXISTS public.error_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  message TEXT NOT NULL,
  stack TEXT,
  name TEXT,
  context JSONB,
  user_id UUID REFERENCES auth.users(id),
  url TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_error_logs_user_id ON public.error_logs(user_id);
CREATE INDEX idx_error_logs_created_at ON public.error_logs(created_at);
```

Затем в `src/app/api/errors/report/route.ts` раскомментируй код сохранения.

---

## 📋 ПЕРЕМЕННЫЕ ОКРУЖЕНИЯ

Добавь в Vercel:

```bash
# Мониторинг ошибок (опционально)
NEXT_PUBLIC_ERROR_MONITORING_ENABLED=true
NEXT_PUBLIC_SENTRY_DSN=xxx  # если используешь Sentry
```

---

## 🚀 ИСПОЛЬЗОВАНИЕ

### Мониторинг ошибок:

```typescript
import { errorMonitor, captureError, captureMessage } from '@/lib/error-monitoring';

// Инициализация (автоматически через ErrorMonitorProvider)
errorMonitor.init(userId);

// Ручной захват ошибки
try {
  // код
} catch (error) {
  captureError(error, { component: 'ChatComponent' });
}

// Захват сообщения
captureMessage('User reached paywall', 'info', { userId });
```

### Модерация контента:

```typescript
import { moderateUserMessage } from '@/lib/content-moderation';

const result = moderateUserMessage(userMessage);
if (!result.allowed) {
  // Показать пользователю result.reason
  return;
}
```

---

## 🛡️ БЕЗОПАСНОСТЬ

### Текущие фильтры:

1. **Самоубийство/самоповреждение** (severity: high)
   - Блокирует сообщение
   - Показывает контакты служб поддержки

2. **Насилие** (severity: high)
   - Блокирует сообщение
   - Предупреждение о службах поддержки

3. **Незаконные вещества** (severity: medium)
   - Блокирует сообщение
   - Информационное сообщение

4. **Спам** (severity: low)
   - Блокирует сообщения с повторяющимися символами
   - Блокирует слишком длинные/короткие сообщения

### Улучшения (будущее):

- Интеграция с OpenAI Moderation API
- Машинное обучение для определения контекста
- Whitelist для доверенных пользователей
- Rate limiting по пользователю

---

## ✅ СТАТУС

- ✅ Базовая структура готова
- ✅ Интеграция в API чата
- ⏳ ErrorMonitorProvider нужно добавить в layout
- ⏳ Внешние сервисы (Sentry) - опционально
- ⏳ Сохранение в БД - опционально

**Всё готово для интеграции! 🎯**

