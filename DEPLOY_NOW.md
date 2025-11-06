# 🚀 ДЕПЛОЙ СЕЙЧАС - Пошаговая инструкция

## ✅ Шаг 1: GitHub репозиторий (2 минуты)

### Вариант A: Создать новый репозиторий
1. Иди на https://github.com/new
2. Название: `ai-chat-pro`
3. Public или Private (на твой выбор)
4. **НЕ** добавляй README, .gitignore, license
5. Нажми "Create repository"
6. Скопируй URL (например: `https://github.com/username/ai-chat-pro.git`)

### Вариант B: Использовать существующий
Если у тебя уже есть репозиторий, просто дай URL.

---

## ✅ Шаг 2: Подключить и запушить (1 минута)

Выполни в терминале (замени URL на свой):

```bash
cd /Users/sanecek/tema/ai-chat-pro
git remote add origin https://github.com/username/ai-chat-pro.git
git branch -M main
git push -u origin main
```

**Если ошибка "remote already exists":**
```bash
git remote remove origin
git remote add origin https://github.com/username/ai-chat-pro.git
git push -u origin main
```

---

## ✅ Шаг 3: Vercel деплой (5 минут)

1. Иди на https://vercel.com
2. Нажми **"Add New Project"**
3. Импортируй репозиторий `ai-chat-pro`
4. Настрой:
   - **Framework Preset:** Next.js (автоопределится)
   - **Root Directory:** `./` (оставь пустым)
   - **Build Command:** `npm run build` (по умолчанию)
   - **Output Directory:** `.next` (по умолчанию)

5. **Добавь Environment Variables** (Settings → Environment Variables):

```
NEXT_PUBLIC_SUPABASE_URL=https://jgnnrdrqzcwnhuuvhlfo.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=твой_anon_key_из_.env.local
SUPABASE_SERVICE_ROLE_KEY=твой_service_role_key_из_.env.local
OPENAI_API_KEY=твой_openai_key_из_.env.local
NEXT_PUBLIC_APP_URL=https://your-project.vercel.app
```

6. Нажми **"Deploy"**
7. Дождись завершения (2-3 минуты)

---

## ✅ Шаг 4: Настроить webhook'и (опционально, для платежей)

### Stripe:
1. Stripe Dashboard → Developers → Webhooks
2. Add endpoint: `https://your-project.vercel.app/api/stripe/webhook`
3. Event: `checkout.session.completed`
4. Скопируй Signing secret → добавь в Vercel как `STRIPE_WEBHOOK_SECRET`

### ЮKassa:
1. ЮKassa Dashboard → Настройки → Уведомления
2. URL: `https://your-project.vercel.app/api/yookassa/webhook`
3. События: `payment.succeeded`

---

## ✅ Шаг 5: Проверить

1. Открой задеплоенный сайт
2. Зарегистрируйся
3. Протестируй чат
4. Проверь личный кабинет

---

## 🎯 Готово!

Сайт работает в продакшене! 🚀

