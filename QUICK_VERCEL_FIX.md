# ⚡ Быстрое исправление деплоя Vercel

## Проблема
Старый сайт (chatdem) деплоится отдельно, а обновления идут на другой сайт.

## Решение за 3 шага

### 1️⃣ Проверить проекты в Vercel

Открой: https://vercel.com/dashboard

**Найди:**
- Проект `chatdem` (старый)
- Проект `ai-chat-pro` (новый)

### 2️⃣ Выбрать один проект

**Вариант А: Использовать `ai-chat-pro` (рекомендуется)**
1. В проекте `ai-chat-pro`: Settings → Domains
2. Добавь домен, который был на `chatdem`
3. Удали проект `chatdem` или отключи его деплой

**Вариант Б: Использовать `chatdem`**
1. В проекте `chatdem`: Settings → Git
2. Подключи репозиторий с новым кодом
3. Удали проект `ai-chat-pro` или отключи его деплой

### 3️⃣ Обновить переменные окружения

В выбранном проекте: Settings → Environment Variables

```env
NEXT_PUBLIC_APP_URL=https://твой-домен.com
```

**Важно:** Замени `твой-домен.com` на реальный домен, который должен быть основным.

### 4️⃣ Передеплоить

```bash
# Локально
vercel --prod

# Или через Git
git push origin main
```

---

## Текущий проект

**Project:** `ai-chat-pro`  
**ID:** `prj_A3mk0085At3UHDg6RqdNdev8VKrs`  
**URL:** `https://ai-chat-*-moytelefonmsk-6183s-projects.vercel.app`

---

## Проверка

✅ Все деплои идут на один домен  
✅ `NEXT_PUBLIC_APP_URL` указывает на правильный домен  
✅ Webhook YooKassa обновлён

