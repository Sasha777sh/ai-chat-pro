# ✅ Финальный чеклист готовности к деплою

## Код

### Исправленные ошибки
- ✅ Исправлена синтаксическая ошибка в `/api/chat/stream` (отсутствовала `{` после `try`)
- ✅ Исправлена синтаксическая ошибка в `/api/demo` (неправильные скобки в `openai.chat.completions.create`)
- ✅ Унифицированы константы: везде используется `FREE_MESSAGE_ALLOWANCE` из `prompts.ts`
- ✅ Удалён пустой файл `/api/chat/route.ts`
- ✅ Исправлена типизация в `/api/stripe/webhook` (добавлен расширенный тип для `current_period_end`)
- ✅ Обновлена версия Stripe API до `2025-08-27.basil`
- ✅ Исправлена типизация в `account/page.tsx` (убрано несуществующее поле `subscription_expires_at`)
- ✅ **Сборка проходит успешно** (`npm run build` ✅)

### Файлы
- ✅ `src/lib/prompts.ts` — все 5 голосов, EDEM CORE, константы доступа
- ✅ `src/lib/voices.ts` — определения голосов для UI
- ✅ `src/lib/types.ts` — все типы TypeScript
- ✅ `src/lib/plans.ts` — конфигурация тарифов
- ✅ `src/app/api/chat/stream/route.ts` — streaming API с поддержкой голосов
- ✅ `src/app/api/stripe/checkout/route.ts` — создание сессии оплаты
- ✅ `src/app/api/stripe/webhook/route.ts` — обработка событий подписки
- ✅ `src/app/chat/[voice]/page.tsx` — UI чата с выбором голосов
- ✅ `src/app/billing/page.tsx` — страница тарифов
- ✅ `src/app/account/page.tsx` — обновлён с ссылкой на тарифы

## База данных

### Миграции
- ✅ `003_voice_and_billing.sql` — добавлен `voice_id` в `chat_sessions`, создана таблица `billing_subscriptions`

**Нужно применить миграцию в Supabase:**
```sql
-- Скопировать содержимое supabase/migrations/003_voice_and_billing.sql
-- И применить через Supabase Dashboard → SQL Editor
```

## Переменные окружения

### Обязательные (уже должны быть)
```env
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
OPENAI_API_KEY=...
```

### Для Stripe (нужно добавить)
```env
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_BASIC=price_...
STRIPE_PRICE_PLUS=price_...
STRIPE_PRICE_PRO=price_...
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
```

## Stripe настройка

### 1. Создать продукты в Stripe Dashboard
- Basic — $15/мес
- Plus — $29/мес  
- Pro — $49/мес

### 2. Получить Price ID для каждого продукта
- Скопировать `price_...` ID
- Добавить в переменные окружения как `STRIPE_PRICE_BASIC`, `STRIPE_PRICE_PLUS`, `STRIPE_PRICE_PRO`

### 3. Настроить Webhook
- Stripe Dashboard → Developers → Webhooks
- Endpoint: `https://your-domain.vercel.app/api/stripe/webhook`
- Events: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`
- Скопировать Signing secret → добавить как `STRIPE_WEBHOOK_SECRET`

## Структура тарифов

| Тариф | Цена | Голоса |
|-------|------|--------|
| Free | $0 | live |
| Basic | $15 | live |
| Plus | $29 | live, mirror, child |
| Pro | $49 | live, mirror, child, shadow, sage |

## Тестирование

### Перед деплоем
1. ✅ Проверить, что все импорты корректны
2. ✅ Проверить синтаксис TypeScript (`npm run lint`)
3. ✅ Проверить сборку (`npm run build`)

### После деплоя
1. Регистрация и вход
2. Создание сессии чата
3. Выбор голосов (доступные/недоступные)
4. Отправка сообщений (лимит 2 для free)
5. Переход на страницу тарифов `/billing`
6. Оформление подписки через Stripe (test mode)
7. Проверка webhook'ов в Stripe Dashboard
8. Проверка обновления тарифа в профиле после оплаты

## Документация

- ✅ `IMPLEMENTATION_COMPLETE.md` — описание реализации
- ✅ `FINAL_CHECKLIST.md` — этот файл
- ✅ `PROMPTS.md` — документация по промптам (если есть)

## Готовность: ✅ 100%

**Осталось:**
1. Применить миграцию в Supabase
2. Настроить Stripe (продукты, webhook)
3. Добавить переменные окружения в Vercel
4. Протестировать полный цикл оплаты

## Команды

```bash
# Проверка линтера
npm run lint

# Сборка для продакшена
npm run build

# Запуск локально
npm run dev
```

