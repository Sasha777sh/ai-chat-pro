# 🚨 СРОЧНО: ИСПРАВИТЬ РЕГИСТРАЦИЮ

## ⚡ КОМАНДЫ ДЛЯ РАЗРАБОТЧИКОВ

### 🔍 ШАГ 1: ДИАГНОСТИКА (5 минут)

```bash
# 1. Проверить логи Vercel
# Зайди в Vercel Dashboard → Project → Logs
# Ищи ошибки за последние 24 часа

# 2. Проверить переменные окружения на Vercel
# Settings → Environment Variables
# Убедись, что есть:
# - NEXT_PUBLIC_SUPABASE_URL
# - NEXT_PUBLIC_SUPABASE_ANON_KEY (должен быть ANON key, НЕ service role!)
# - SUPABASE_SERVICE_ROLE_KEY
# - OPENAI_API_KEY

# 3. Проверить Supabase
# Зайди в Supabase Dashboard → Logs → API Logs
# Ищи ошибки при регистрации
```

---

### 🔧 ШАГ 2: ПРОВЕРКА КОДА (10 минут)

```bash
# Открой файл регистрации
cd /Users/sanecek/tema/ai-chat-pro
cat src/app/api/auth/register/route.ts

# Проверь, что:
# 1. Все переменные окружения проверяются
# 2. Есть обработка ошибок
# 3. Логирование работает
```

---

### 🛠️ ШАГ 3: ИСПРАВЛЕНИЕ (15 минут)

**Проблема 1: Неправильные переменные окружения**

```bash
# На Vercel проверь:
# NEXT_PUBLIC_SUPABASE_ANON_KEY должен начинаться с eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9
# Если там service role key → замени на anon key из Supabase Dashboard
```

**Проблема 2: Триггер не создан в Supabase**

```sql
-- Выполни в Supabase SQL Editor:

-- Проверь, есть ли триггер:
SELECT * FROM pg_trigger WHERE tgname = 'on_auth_user_created';

-- Если нет → создай:
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, subscription_tier)
  VALUES (NEW.id, NEW.email, 'free')
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

**Проблема 3: RLS policies блокируют доступ**

```sql
-- Проверь политики в Supabase:
-- Dashboard → Authentication → Policies

-- Убедись, что есть:
-- "Users can insert own profile"
-- "Users can select own profile"
```

---

### 🧪 ШАГ 4: ТЕСТИРОВАНИЕ (5 минут)

```bash
# 1. Локальный тест
cd /Users/sanecek/tema/ai-chat-pro
npm run dev

# 2. Открой http://localhost:3000/signup
# 3. Попробуй зарегистрироваться
# 4. Проверь консоль браузера (F12) на ошибки
# 5. Проверь терминал на ошибки сервера
```

---

### 📊 ШАГ 5: МОНИТОРИНГ (после деплоя)

```bash
# После деплоя на Vercel:

# 1. Проверь логи в реальном времени
# Vercel Dashboard → Logs → Real-time

# 2. Попробуй зарегистрироваться на продакшене
# https://chatedem.com/signup

# 3. Если ошибка → скопируй полный текст ошибки
# 4. Проверь, что пользователь создался в Supabase
# Dashboard → Authentication → Users
```

---

## 🎯 КОНКРЕТНЫЕ ДЕЙСТВИЯ

### ДЛЯ BACKEND РАЗРАБОТЧИКА:

1. **Открой Vercel Dashboard:**
   - https://vercel.com/dashboard
   - Найди проект `ai-chat-pro` или `chatedem`
   - Settings → Environment Variables

2. **Проверь переменные:**
   ```
   NEXT_PUBLIC_SUPABASE_URL = https://xxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY = eyJ... (ANON KEY!)
   SUPABASE_SERVICE_ROLE_KEY = eyJ... (SERVICE ROLE KEY)
   ```

3. **Если NEXT_PUBLIC_SUPABASE_ANON_KEY = service role key:**
   - Открой Supabase Dashboard
   - Settings → API
   - Скопируй **anon/public key** (НЕ service role!)
   - Вставь в Vercel как NEXT_PUBLIC_SUPABASE_ANON_KEY
   - Redeploy проект

---

### ДЛЯ DEVOPS:

1. **Проверь логи Vercel:**
   ```
   Vercel Dashboard → Project → Logs
   Фильтр: "register" или "auth"
   Время: последние 24 часа
   ```

2. **Проверь Supabase логи:**
   ```
   Supabase Dashboard → Logs → API Logs
   Фильтр: "createUser" или "auth"
   ```

3. **Если видишь ошибку "Invalid API key":**
   - Это значит, что в NEXT_PUBLIC_SUPABASE_ANON_KEY стоит service role key
   - Замени на anon key

---

### ДЛЯ QA:

1. **Создай тестовый аккаунт вручную:**
   ```sql
   -- В Supabase SQL Editor:
   INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at)
   VALUES (
     gen_random_uuid(),
     'test@chatedem.com',
     crypt('TestPass123', gen_salt('bf')),
     now(),
     now()
   );
   ```

2. **Протестируй полный flow:**
   - Регистрация → Вход → Чат → Оплата

---

## 🚨 ЕСЛИ НИЧЕГО НЕ ПОМОГАЕТ

### ВРЕМЕННОЕ РЕШЕНИЕ:

1. **Создай тестовые аккаунты вручную:**
   - В Supabase Dashboard → Authentication → Users
   - Создай 5-10 тестовых аккаунтов
   - Раздай их тестировщикам

2. **Добавь bypass для демо:**
   ```typescript
   // В src/app/signup/page.tsx добавь кнопку:
   <button onClick={() => {
     // Автоматический вход с тестовым аккаунтом
     router.push('/login?demo=true');
   }}>
     Войти как демо-пользователь
   </button>
   ```

---

## 📞 ЕСЛИ НУЖНА ПОМОЩЬ

**Пришли мне:**
1. Скриншот ошибки из браузера (F12 → Console)
2. Логи из Vercel (последние 10 строк)
3. Логи из Supabase (API Logs)
4. Значения переменных окружения (без секретов, только названия)

**Я найду проблему за 5 минут! 🎯**

---

## ✅ ЧЕКЛИСТ ИСПРАВЛЕНИЯ

- [ ] Проверены переменные окружения на Vercel
- [ ] NEXT_PUBLIC_SUPABASE_ANON_KEY = anon key (НЕ service role!)
- [ ] Триггер создан в Supabase
- [ ] RLS policies настроены
- [ ] Протестирована регистрация локально
- [ ] Протестирована регистрация на продакшене
- [ ] Логи проверены на ошибки
- [ ] Тестовый аккаунт создан

**После выполнения всех пунктов → регистрация должна работать! ✅**

