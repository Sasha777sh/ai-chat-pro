# 🚨 КОМАНДЫ ДЛЯ КОМАНДЫ EDEM - ИСПРАВИТЬ РЕГИСТРАЦИЮ

## ⚡ ВЫПОЛНИ ЭТИ КОМАНДЫ ПРЯМО СЕЙЧАС

### 🔍 ДЛЯ BACKEND РАЗРАБОТЧИКА:

```bash
# 1. Проверь переменные окружения на Vercel
# Открой: https://vercel.com/dashboard
# Найди проект → Settings → Environment Variables
# Проверь:
# - NEXT_PUBLIC_SUPABASE_URL
# - NEXT_PUBLIC_SUPABASE_ANON_KEY (должен быть ANON key!)
# - SUPABASE_SERVICE_ROLE_KEY

# 2. Проверь логи Vercel
# Vercel Dashboard → Project → Logs
# Ищи ошибки с тегом [REGISTER]

# 3. Если видишь "Invalid API key":
# - Открой Supabase Dashboard → Settings → API
# - Скопируй anon/public key
# - Вставь в Vercel как NEXT_PUBLIC_SUPABASE_ANON_KEY
# - Redeploy проект
```

---

### 🗄️ ДЛЯ DEVOPS / DATABASE:

```sql
-- Выполни в Supabase SQL Editor:

-- 1. Проверь триггер:
SELECT 
  tgname as trigger_name,
  tgrelid::regclass as table_name
FROM pg_trigger 
WHERE tgname = 'on_auth_user_created';

-- 2. Если триггера нет → создай:
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

-- 3. Проверь RLS policies:
SELECT * FROM pg_policies WHERE tablename = 'profiles';

-- 4. Если политик нет → создай:
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);
```

---

### 🧪 ДЛЯ QA:

```bash
# 1. Локальное тестирование:
cd /Users/sanecek/tema/ai-chat-pro
npm run dev

# 2. Открой http://localhost:3000/signup
# 3. Попробуй зарегистрироваться
# 4. Проверь консоль браузера (F12) на ошибки
# 5. Проверь терминал на логи [REGISTER]

# 6. После успешной регистрации:
# - Проверь, что пользователь создан в Supabase
# - Проверь, что профиль создан
# - Попробуй войти
```

---

### 📊 ДЛЯ PRODUCT MANAGER:

```bash
# 1. Создай тестовый аккаунт вручную (если регистрация не работает):

# В Supabase SQL Editor:
INSERT INTO auth.users (
  id, 
  email, 
  encrypted_password, 
  email_confirmed_at, 
  created_at
)
VALUES (
  gen_random_uuid(),
  'demo@chatedem.com',
  crypt('DemoPass123', gen_salt('bf')),
  now(),
  now()
);

# Затем создай профиль:
INSERT INTO public.profiles (id, email, subscription_tier)
SELECT id, email, 'free' 
FROM auth.users 
WHERE email = 'demo@chatedem.com';

# 2. Проверь метрики:
# - Сколько попыток регистрации за последние 24 часа?
# - Сколько успешных регистраций?
# - Какие ошибки чаще всего?
```

---

## 🎯 КОНКРЕТНЫЕ ДЕЙСТВИЯ

### ДЕЙСТВИЕ 1: Проверь переменные на Vercel (5 минут)

1. Открой: https://vercel.com/dashboard
2. Найди проект `ai-chat-pro` или `chatedem`
3. Settings → Environment Variables
4. Проверь `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. Если там service role key → замени на anon key
6. Redeploy проект

### ДЕЙСТВИЕ 2: Проверь триггер в Supabase (3 минуты)

1. Открой: https://supabase.com/dashboard
2. SQL Editor
3. Выполни команду проверки триггера (см. выше)
4. Если триггера нет → создай (см. выше)

### ДЕЙСТВИЕ 3: Протестируй локально (5 минут)

```bash
cd /Users/sanecek/tema/ai-chat-pro
npm run dev
# Открой http://localhost:3000/signup
# Попробуй зарегистрироваться
# Смотри логи в терминале
```

---

## 🚨 ЕСЛИ НИЧЕГО НЕ ПОМОГАЕТ

### ВРЕМЕННОЕ РЕШЕНИЕ:

1. **Создай тестовые аккаунты вручную** (см. выше)
2. **Добавь кнопку "Войти как демо"** для тестирования
3. **Покажи детальные ошибки** пользователям (в development режиме)

---

## 📞 ПРИШЛИ МНЕ:

1. Скриншот ошибки из браузера (F12 → Console)
2. Логи из Vercel (последние 10 строк с [REGISTER])
3. Результат проверки триггера (SQL запрос)
4. Значения переменных (только названия, без секретов)

**Я найду проблему за 5 минут! 🎯**

---

## ✅ ЧЕКЛИСТ

- [ ] Переменные окружения проверены на Vercel
- [ ] NEXT_PUBLIC_SUPABASE_ANON_KEY = anon key (НЕ service role!)
- [ ] Триггер создан в Supabase
- [ ] RLS policies настроены
- [ ] Локальное тестирование пройдено
- [ ] Логи проверены
- [ ] Регистрация работает

**После выполнения → регистрация должна работать! ✅**

