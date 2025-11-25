# 🔑 Service Role Key - Быстрая инструкция

## ✅ Твой Anon Key правильный!

**Твой anon key:**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impnbm5yZHJxemN3bmh1dXZobGZvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU3NjU1NTgsImV4cCI6MjA3MTM0MTU1OH0.BZBBo_yNxr7EQqmiI6toKI8y9BEpSjbFQraCo_h7I4A
```

**Проверка:**
- ✅ Содержит `"role":"anon"` → правильный!
- ✅ Project: `jgnnrdrqzcwnhuuvhlfo`

---

## 🔑 ГДЕ ВЗЯТЬ SERVICE ROLE KEY

### Прямая ссылка на API Settings:

**https://supabase.com/dashboard/project/jgnnrdrqzcwnhuuvhlfo/settings/api**

**Или:**

1. Открой: https://supabase.com/dashboard
2. Найди проект (ref: `jgnnrdrqzcwnhuuvhlfo`)
3. Settings → API
4. Найди секцию **"Project API keys"**
5. Скопируй **service_role** key (НЕ anon/public!)

---

## 📋 ЧТО ДОЛЖНО БЫТЬ

**После получения:**

```bash
# Anon Key (уже есть) ✅
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ... (содержит "role":"anon")

# Service Role Key (нужно получить) ⚠️
SUPABASE_SERVICE_ROLE_KEY=eyJ... (содержит "role":"service_role")
```

---

## 🔍 КАК ПРОВЕРИТЬ

**1. Скопируй service role key**

**2. Открой:** https://jwt.io

**3. Вставь ключ**

**4. Проверь payload:**
```json
{
  "role": "service_role"  ← Должно быть это!
}
```

**Если `"role":"service_role"`** → ✅ Правильно!

---

## 🚀 ЧТО ДЕЛАТЬ ПОСЛЕ ПОЛУЧЕНИЯ

**1. Добавь на Vercel:**
- Открой проект: https://vercel.com/dashboard
- Найди проект (может быть `ai-chat-pro` или `chatedem.com`)
- Settings → Environment Variables
- Добавь `SUPABASE_SERVICE_ROLE_KEY`
- Вставь скопированный ключ
- Выбери окружения: Production, Preview
- Сохрани

**2. Передеплой:**
- Deployments → Redeploy
- Или: `git commit --allow-empty -m "Add service role key" && git push`

---

## ⚠️ ВАЖНО

**Service Role Key:**
- 🔴 Секретный ключ — не публикуй!
- 🔴 Обходит RLS — полный доступ к БД
- 🔴 Только на сервере — не в клиенте!

**Где использовать:**
- ✅ Только в API routes
- ✅ Только в переменных окружения на Vercel
- ❌ НЕ в `NEXT_PUBLIC_*` переменных

---

## 📝 ПРОЕКТЫ НА VERCEL

**Я вижу, что у тебя есть проект:**
- https://ai-chat-pro.vercel.app

**Проверь:**
- Это тот же проект, что и `chatedem.com`?
- Или это разные проекты?

**Если разные проекты:**
- Добавь переменные в оба проекта на Vercel
- Или используй один проект для обоих доменов

---

**Получи service role key из Supabase Dashboard и добавь на Vercel! 🚀**

