# ✅ ЧЕКЛИСТ: Переменные окружения для Vercel

## 🔴 КРИТИЧЕСКИЕ (обязательно для работы чата)

### 1. Supabase
```bash
NEXT_PUBLIC_SUPABASE_URL=https://jgnnrdrqzcwnhuuvhlfo.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impnbm5yZHJxemN3bmh1dXZobGZvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU3NjU1NTgsImV4cCI6MjA3MTM0MTU1OH0.BZBBo_yNxr7EQqmiI6toKI8y9BEpSjbFQraCo_h7I4A
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impnbm5yZHJxemN3bmh1dXZobGZvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NTc2NTU1OCwiZXhwIjoyMDcxMzQxNTU4fQ.cmYE8P_vlN_YNjvXI6JqEb7hiheIC5YUe0ptu5rvW0Y
```

**⚠️ ВАЖНО:** 
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` должен содержать `"role":"anon"` в JWT
- `SUPABASE_SERVICE_ROLE_KEY` должен содержать `"role":"service_role"` в JWT
- Если перепутаны → будет ошибка 401!

**Как проверить:**
1. Скопируй ключ
2. Открой: https://jwt.io
3. Вставь в "Encoded"
4. Проверь поле `"role"` в payload

---

### 2. OpenAI
```bash
OPENAI_API_KEY=sk-proj-... (твой API ключ из .env.local)
```

---

## 🟡 ВАЖНЫЕ (для оплаты)

### 3. YooKassa
```bash
YK_SHOP_ID=your_shop_id
YK_SECRET_KEY=your_secret_key
```

**Где взять:**
- https://yookassa.ru/developers/payment-acceptance/getting-started/quick-start

---

### 4. App URL
```bash
NEXT_PUBLIC_APP_URL=https://chatedem.com
```

**⚠️ ВАЖНО:** 
- Локально: `http://localhost:3000`
- Продакшен: `https://chatedem.com`

---

## 🟢 ОПЦИОНАЛЬНЫЕ

### 5. Криптоплатежи
```bash
CRYPTO_IPN_SECRET=your_ipn_secret
```

### 6. Ручная оплата
```bash
MANUAL_PAYMENT_CARD=XXXX XXXX XXXX XXXX
MANUAL_PAYMENT_NAME=Your Name
MANUAL_PAYMENT_BANK=Bank Name
```

### 7. Поддержка
```bash
SUPPORT_EMAIL=support@chatedem.com
```

---

## ⚪ НЕ ИСПОЛЬЗУЕТСЯ (можно не добавлять)

### Stripe (не используется, используется YooKassa)
```bash
STRIPE_SECRET_KEY=sk_test_... (не нужно)
STRIPE_WEBHOOK_SECRET=whsec_... (не нужно)
```

---

## 📋 ЧЕКЛИСТ ДЛЯ VERCEL

**Открой:** https://vercel.com/dashboard → Settings → Environment Variables

**Проверь наличие:**
- [ ] `NEXT_PUBLIC_SUPABASE_URL`
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` (должен быть anon key!)
- [ ] `SUPABASE_SERVICE_ROLE_KEY` (должен быть service role key)
- [ ] `OPENAI_API_KEY`
- [ ] `YK_SHOP_ID` (если нужна оплата)
- [ ] `YK_SECRET_KEY` (если нужна оплата)
- [ ] `NEXT_PUBLIC_APP_URL` (должен быть `https://chatedem.com`)

**Проверь правильность:**
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` содержит `"role":"anon"` (проверь на jwt.io)
- [ ] `SUPABASE_SERVICE_ROLE_KEY` содержит `"role":"service_role"` (проверь на jwt.io)
- [ ] Все значения совпадают с локальными (из `.env.local`)

---

## 🚀 БЫСТРАЯ ПРОВЕРКА

**1. Локально:**
```bash
cd /Users/sanecek/tema/ai-chat-pro
cat .env.local | grep -E "NEXT_PUBLIC_SUPABASE|SUPABASE_SERVICE|OPENAI"
```

**2. На Vercel:**
- Открой: https://vercel.com/dashboard
- Найди проект `chatedem.com`
- Settings → Environment Variables
- Сравни с локальными значениями

**3. Если не совпадают:**
- Скопируй значения из `.env.local`
- Обнови на Vercel
- Передеплой проект (Redeploy)

---

## ⚠️ САМАЯ ЧАСТАЯ ОШИБКА

**Проблема:** `NEXT_PUBLIC_SUPABASE_ANON_KEY` содержит service role key вместо anon key

**Симптом:** Ошибка 401 "Your authentication token is not from a valid issuer"

**Решение:**
1. Открой Supabase Dashboard → Settings → API
2. Скопируй правильный **anon/public key**
3. Обнови на Vercel
4. Передеплой проект

---

**После проверки и обновления переменных ошибка 401 должна исчезнуть! 🎉**

