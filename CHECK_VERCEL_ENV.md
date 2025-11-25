# 🔍 ПРОВЕРКА: Переменные окружения на Vercel

## ✅ ЛОКАЛЬНЫЕ ПЕРЕМЕННЫЕ (правильные)

Из `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=https://jgnnrdrqzcwnhuuvhlfo.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ... (содержит "role":"anon")
SUPABASE_SERVICE_ROLE_KEY=eyJ... (содержит "role":"service_role")
```

**Код использует правильные переменные:**
- ✅ `supabaseAnonKey` для проверки токена
- ✅ `supabaseServiceKey` для чтения данных

---

## 🎯 ЧТО ПРОВЕРИТЬ НА VERCEL

### 1. Открой Vercel Dashboard

**Ссылка:** https://vercel.com/dashboard

**Действия:**
1. Найди проект с доменом `chatedem.com`
2. Открой: Settings → Environment Variables

### 2. Проверь переменные

**Должны быть:**
```
NEXT_PUBLIC_SUPABASE_URL = https://jgnnrdrqzcwnhuuvhlfo.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impnbm5yZHJxemN3bmh1dXZobGZvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU3NjU1NTgsImV4cCI6MjA3MTM0MTU1OH0.BZBBo_yNxr7EQqmiI6toKI8y9BEpSjbFQraCo_h7I4A
SUPABASE_SERVICE_ROLE_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impnbm5yZHJxemN3bmh1dXZobGZvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NTc2NTU1OCwiZXhwIjoyMDcxMzQxNTU4fQ.cmYE8P_vlN_YNjvXI6JqEb7hiheIC5YUe0ptu5rvW0Y
```

### 3. Как проверить правильность ключей

**NEXT_PUBLIC_SUPABASE_ANON_KEY должен:**
- Начинаться с `eyJ...`
- Содержать `"role":"anon"` в JWT payload
- НЕ содержать `"role":"service_role"`

**SUPABASE_SERVICE_ROLE_KEY должен:**
- Начинаться с `eyJ...`
- Содержать `"role":"service_role"` в JWT payload

**Как проверить JWT:**
1. Скопируй ключ
2. Открой: https://jwt.io
3. Вставь ключ в "Encoded"
4. Проверь поле `"role"` в payload:
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` → должно быть `"anon"`
   - `SUPABASE_SERVICE_ROLE_KEY` → должно быть `"service_role"`

---

## ⚠️ ЧАСТЫЕ ОШИБКИ

### Ошибка 1: Перепутаны ключи

**Симптом:** `NEXT_PUBLIC_SUPABASE_ANON_KEY` содержит service role key

**Решение:**
1. Открой Supabase Dashboard → Settings → API
2. Скопируй правильный **anon/public key**
3. Обнови на Vercel
4. Передеплой проект

### Ошибка 2: Ключи не совпадают с локальными

**Симптом:** На Vercel другие ключи, чем в `.env.local`

**Решение:**
1. Скопируй ключи из `.env.local`
2. Обнови на Vercel
3. Передеплой проект

### Ошибка 3: Переменные не загружены

**Симптом:** Ошибка "NEXT_PUBLIC_SUPABASE_ANON_KEY is not defined"

**Решение:**
1. Проверь, что переменные добавлены для **Production**
2. Передеплой проект

---

## ✅ ЧЕКЛИСТ

- [ ] Открыл Vercel Dashboard
- [ ] Нашёл проект `chatedem.com`
- [ ] Открыл Settings → Environment Variables
- [ ] Проверил `NEXT_PUBLIC_SUPABASE_URL` (должен совпадать с локальным)
- [ ] Проверил `NEXT_PUBLIC_SUPABASE_ANON_KEY` (должен быть anon key, не service role!)
- [ ] Проверил `SUPABASE_SERVICE_ROLE_KEY` (должен быть service role key)
- [ ] Если не совпадают → обновил на Vercel
- [ ] Передеплоил проект (Redeploy)

---

## 🚀 БЫСТРЫЕ ДЕЙСТВИЯ

**Если ключи не совпадают:**

1. **Скопируй из Supabase:**
   - Открой: https://supabase.com/dashboard
   - Settings → API
   - Скопируй **anon/public key** и **service_role key**

2. **Обнови на Vercel:**
   - Vercel Dashboard → Settings → Environment Variables
   - Обнови `NEXT_PUBLIC_SUPABASE_ANON_KEY` и `SUPABASE_SERVICE_ROLE_KEY`

3. **Передеплой:**
   - Vercel Dashboard → Deployments → Redeploy
   - Или: `git commit --allow-empty -m "Redeploy" && git push`

4. **Подожди 2-3 минуты** и проверь снова

---

**После этого ошибка 401 должна исчезнуть! 🎉**

