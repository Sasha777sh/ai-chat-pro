# 🔑 Как получить Service Role Key из Supabase

## ✅ ПРОВЕРКА: Anon Key правильный

**Твой anon key:**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impnbm5yZHJxemN3bmh1dXZobGZvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU3NjU1NTgsImV4cCI6MjA3MTM0MTU1OH0.BZBBo_yNxr7EQqmiI6toKI8y9BEpSjbFQraCo_h7I4A
```

**Проверка:**
- ✅ Содержит `"role":"anon"` → правильный anon key!
- ✅ Project ref: `jgnnrdrqzcwnhuuvhlfo` → правильный проект

---

## 🔑 КАК ПОЛУЧИТЬ SERVICE ROLE KEY

### Шаг 1: Открой Supabase Dashboard

**Ссылка:** https://supabase.com/dashboard

### Шаг 2: Найди проект

**Project URL:** `https://jgnnrdrqzcwnhuuvhlfo.supabase.co`

**Или найди по названию проекта в списке проектов**

### Шаг 3: Открой Settings → API

1. В левом меню выбери **Settings** (шестерёнка)
2. Выбери **API** в подменю

### Шаг 4: Скопируй Service Role Key

**Найди секцию "Project API keys":**

Там будут два ключа:
1. **anon/public** (уже есть у тебя) ✅
2. **service_role** (нужен тебе) ⚠️

**⚠️ ВАЖНО:**
- Service Role Key начинается с `eyJ...`
- Содержит `"role":"service_role"` в JWT
- **НЕ показывай его публично!** Это секретный ключ

### Шаг 5: Скопируй ключ

**Нажми на иконку копирования** рядом с service_role key

**Или выдели и скопируй вручную**

---

## 📋 ЧТО ДОЛЖНО БЫТЬ

**После получения у тебя будет:**

```bash
# Anon Key (уже есть)
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ... (содержит "role":"anon")

# Service Role Key (нужно получить)
SUPABASE_SERVICE_ROLE_KEY=eyJ... (содержит "role":"service_role")
```

---

## 🔍 КАК ПРОВЕРИТЬ ПРАВИЛЬНОСТЬ SERVICE ROLE KEY

**1. Скопируй ключ**

**2. Открой:** https://jwt.io

**3. Вставь ключ в "Encoded"**

**4. Проверь payload:**
```json
{
  "iss": "supabase",
  "ref": "jgnnrdrqzcwnhuuvhlfo",
  "role": "service_role",  ← Должно быть "service_role"!
  "iat": 1755765558,
  "exp": 2071341558
}
```

**Если `"role":"service_role"`** → ✅ Правильный ключ!

**Если `"role":"anon"`** → ❌ Это anon key, не service role!

---

## ⚠️ БЕЗОПАСНОСТЬ

**Service Role Key:**
- 🔴 **Секретный ключ** — не публикуй его!
- 🔴 **Обходит RLS** — имеет полный доступ к БД
- 🔴 **Только на сервере** — не используй на клиенте!

**Где использовать:**
- ✅ Только в API routes (серверный код)
- ✅ Только в переменных окружения на Vercel
- ❌ НЕ в `NEXT_PUBLIC_*` переменных
- ❌ НЕ в клиентском коде

---

## 🚀 ЧТО ДЕЛАТЬ ПОСЛЕ ПОЛУЧЕНИЯ

**1. Добавь в `.env.local` (локально):**
```bash
SUPABASE_SERVICE_ROLE_KEY=eyJ... (скопированный ключ)
```

**2. Добавь на Vercel:**
- Открой проект на Vercel
- Settings → Environment Variables
- Добавь `SUPABASE_SERVICE_ROLE_KEY`
- Выбери окружения (Production, Preview)
- Сохрани

**3. Передеплой проект:**
- Vercel Dashboard → Deployments → Redeploy
- Или: `git commit --allow-empty -m "Add service role key" && git push`

---

## 📝 ПОЛНЫЙ СПИСОК ПЕРЕМЕННЫХ

**После получения service role key у тебя должно быть:**

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://jgnnrdrqzcwnhuuvhlfo.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ... (anon key - уже есть)
SUPABASE_SERVICE_ROLE_KEY=eyJ... (service role key - нужно получить)

# OpenAI
OPENAI_API_KEY=sk-proj-...

# YooKassa (для оплаты)
YK_SHOP_ID=...
YK_SECRET_KEY=...

# App URL
NEXT_PUBLIC_APP_URL=https://chatedem.com
```

---

## 🔗 ПРЯМАЯ ССЫЛКА

**Если проект уже открыт:**
https://supabase.com/dashboard/project/jgnnrdrqzcwnhuuvhlfo/settings/api

**Или:**
1. https://supabase.com/dashboard
2. Найди проект
3. Settings → API
4. Скопируй **service_role** key

---

**Получи service role key и добавь его на Vercel — это решит проблему с ошибкой 401! 🚀**

