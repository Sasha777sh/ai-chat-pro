# 📋 ПОЛНЫЙ СПИСОК ПЕРЕМЕННЫХ ОКРУЖЕНИЯ

## 🔴 КРИТИЧЕСКИЕ (обязательные для работы)

### Supabase
```bash
NEXT_PUBLIC_SUPABASE_URL=https://jgnnrdrqzcwnhuuvhlfo.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ... (anon/public key из Supabase)
SUPABASE_SERVICE_ROLE_KEY=eyJ... (service_role key из Supabase)
```

**Где используются:**
- `NEXT_PUBLIC_SUPABASE_URL` — все API routes, клиент
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — проверка токенов пользователей, клиент
- `SUPABASE_SERVICE_ROLE_KEY` — чтение/запись данных (обходит RLS), только сервер

**Где взять:**
- Supabase Dashboard → Settings → API
- **ВАЖНО:** `NEXT_PUBLIC_SUPABASE_ANON_KEY` должен быть **anon/public key**, НЕ service role!

---

### OpenAI
```bash
OPENAI_API_KEY=sk-proj-... (API ключ OpenAI)
```

**Где используется:**
- `/api/chat/stream` — генерация ответов ИИ
- `/api/demo` — демо-чат

**Где взять:**
- https://platform.openai.com/api-keys

---

## 🟡 ВАЖНЫЕ (для оплаты и функционала)

### YooKassa (платежи для России)
```bash
YK_SHOP_ID=your_shop_id
YK_SECRET_KEY=your_secret_key
```

**Где используются:**
- `/api/yookassa/checkout` — создание платежа
- `/api/yookassa/webhook` — обработка webhook

**Где взять:**
- https://yookassa.ru/developers/payment-acceptance/getting-started/quick-start

---

### Stripe (не используется, но есть в коде)
```bash
STRIPE_SECRET_KEY=sk_test_... (для тестов)
STRIPE_WEBHOOK_SECRET=whsec_... (webhook secret)
```

**Где используются:**
- `/api/stripe/checkout` — создание платежа
- `/api/stripe/webhook` — обработка webhook

**Статус:** Не используется (используется YooKassa)

---

### Криптоплатежи
```bash
CRYPTO_IPN_SECRET=your_ipn_secret
```

**Где используется:**
- `/api/crypto/ipn` — обработка IPN (Instant Payment Notification)

**Где взять:**
- Настройки криптоплатежного провайдера

---

## 🟢 ОПЦИОНАЛЬНЫЕ (для улучшения UX)

### App URL
```bash
NEXT_PUBLIC_APP_URL=https://chatedem.com
```

**Где используется:**
- `/api/yookassa/checkout` — return_url после оплаты
- `/api/stripe/checkout` — success_url

**Локально:** `http://localhost:3000`
**Продакшен:** `https://chatedem.com`

---

### Ручная оплата (опционально)
```bash
MANUAL_PAYMENT_CARD=XXXX XXXX XXXX XXXX
MANUAL_PAYMENT_NAME=Your Name
MANUAL_PAYMENT_BANK=Bank Name
```

**Где используется:**
- `/api/payment/manual` — информация для ручной оплаты

**Статус:** Опционально, есть значения по умолчанию

---

### Поддержка (опционально)
```bash
SUPPORT_EMAIL=support@chatedem.com
```

**Где используется:**
- `/api/payment/manual` — email для связи

**Статус:** Опционально, есть значение по умолчанию

---

## 📊 СВОДНАЯ ТАБЛИЦА

| Переменная | Обязательная | Где используется | Где взять |
|------------|-------------|-----------------|-----------|
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ Да | Все API, клиент | Supabase Dashboard |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ Да | Проверка токенов | Supabase Dashboard (anon key!) |
| `SUPABASE_SERVICE_ROLE_KEY` | ✅ Да | Чтение/запись данных | Supabase Dashboard (service role) |
| `OPENAI_API_KEY` | ✅ Да | Генерация ответов ИИ | OpenAI Platform |
| `YK_SHOP_ID` | 🟡 Для оплаты | YooKassa checkout | YooKassa Dashboard |
| `YK_SECRET_KEY` | 🟡 Для оплаты | YooKassa checkout | YooKassa Dashboard |
| `NEXT_PUBLIC_APP_URL` | 🟢 Опционально | Return URLs | Твой домен |
| `CRYPTO_IPN_SECRET` | 🟢 Опционально | Криптоплатежи | Провайдер |
| `STRIPE_SECRET_KEY` | ⚪ Не используется | Stripe (не используется) | Stripe Dashboard |
| `STRIPE_WEBHOOK_SECRET` | ⚪ Не используется | Stripe (не используется) | Stripe Dashboard |
| `MANUAL_PAYMENT_*` | 🟢 Опционально | Ручная оплата | Твои данные |
| `SUPPORT_EMAIL` | 🟢 Опционально | Поддержка | Твой email |

---

## ✅ МИНИМАЛЬНЫЙ НАБОР ДЛЯ РАБОТЫ

**Для работы чата (без оплаты):**
```bash
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=... (anon key!)
SUPABASE_SERVICE_ROLE_KEY=... (service role key)
OPENAI_API_KEY=...
```

**Для полной работы (с оплатой):**
```bash
# Все выше +
YK_SHOP_ID=...
YK_SECRET_KEY=...
NEXT_PUBLIC_APP_URL=https://chatedem.com
```

---

## 🔍 ПРОВЕРКА НА VERCEL

**Обязательно проверь на Vercel:**
1. ✅ `NEXT_PUBLIC_SUPABASE_URL`
2. ✅ `NEXT_PUBLIC_SUPABASE_ANON_KEY` (должен быть anon key!)
3. ✅ `SUPABASE_SERVICE_ROLE_KEY` (должен быть service role key)
4. ✅ `OPENAI_API_KEY`

**Для оплаты:**
5. 🟡 `YK_SHOP_ID`
6. 🟡 `YK_SECRET_KEY`
7. 🟡 `NEXT_PUBLIC_APP_URL` (должен быть `https://chatedem.com`)

---

## ⚠️ ВАЖНЫЕ ЗАМЕЧАНИЯ

1. **`NEXT_PUBLIC_SUPABASE_ANON_KEY`** — это **anon/public key**, НЕ service role key!
   - Если там service role key → будет ошибка 401 "token is not from a valid issuer"

2. **`NEXT_PUBLIC_*`** переменные доступны на клиенте (браузер)
   - Не храни секреты в `NEXT_PUBLIC_*`!

3. **`SUPABASE_SERVICE_ROLE_KEY`** — секретный ключ, только на сервере
   - Не должен быть в `NEXT_PUBLIC_*`!

4. **Локально vs Продакшен:**
   - Локально: `.env.local`
   - Продакшен: Vercel Dashboard → Environment Variables

---

## 🚀 БЫСТРАЯ ПРОВЕРКА

**Проверь локально:**
```bash
cd /Users/sanecek/tema/ai-chat-pro
cat .env.local | grep -E "NEXT_PUBLIC_SUPABASE|SUPABASE_SERVICE|OPENAI"
```

**Проверь на Vercel:**
1. https://vercel.com/dashboard
2. Найди проект `chatedem.com`
3. Settings → Environment Variables
4. Сравни с локальными значениями

---

**Все переменные должны совпадать на локальной машине и на Vercel!**

