# 🐛 ОТЛАДКА РЕГИСТРАЦИИ - ПОШАГОВАЯ ИНСТРУКЦИЯ

## 🎯 ЦЕЛЬ: Найти и исправить ошибку регистрации за 30 минут

---

## ШАГ 1: ПРОВЕРКА ПЕРЕМЕННЫХ ОКРУЖЕНИЯ (5 мин)

### На Vercel:

1. Открой: https://vercel.com/dashboard
2. Найди проект → Settings → Environment Variables
3. Проверь эти переменные:

```
✅ NEXT_PUBLIC_SUPABASE_URL
   Должно быть: https://xxx.supabase.co

✅ NEXT_PUBLIC_SUPABASE_ANON_KEY  
   Должно начинаться с: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9
   ⚠️ ВАЖНО: Это должен быть ANON key, НЕ service role key!

✅ SUPABASE_SERVICE_ROLE_KEY
   Должно начинаться с: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9
   ⚠️ ВАЖНО: Это должен быть SERVICE ROLE key
```

### Как проверить правильность:

1. Открой Supabase Dashboard: https://supabase.com/dashboard
2. Settings → API
3. Сравни ключи:
   - **anon/public key** → должен быть в `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role key** → должен быть в `SUPABASE_SERVICE_ROLE_KEY`

### Если ключи не совпадают:

```bash
# 1. Скопируй правильные ключи из Supabase
# 2. Обнови на Vercel
# 3. ОБЯЗАТЕЛЬНО передеплой:
#    Vercel Dashboard → Deployments → Redeploy
```

---

## ШАГ 2: ПРОВЕРКА ТРИГГЕРА В SUPABASE (5 мин)

### Выполни в Supabase SQL Editor:

```sql
-- 1. Проверь, есть ли триггер:
SELECT 
  tgname as trigger_name,
  tgrelid::regclass as table_name,
  proname as function_name
FROM pg_trigger t
JOIN pg_proc p ON t.tgfoid = p.oid
WHERE tgname = 'on_auth_user_created';
```

### Если триггера нет → создай:

```sql
-- Создай функцию:
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, subscription_tier)
  VALUES (NEW.id, NEW.email, 'free')
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Создай триггер:
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

---

## ШАГ 3: ПРОВЕРКА RLS POLICIES (5 мин)

### В Supabase Dashboard:

1. Authentication → Policies
2. Проверь таблицу `profiles`:

```sql
-- Должны быть политики:
-- 1. "Users can view own profile"
SELECT * FROM profiles WHERE id = auth.uid();

-- 2. "Users can insert own profile"  
INSERT INTO profiles (id, email) VALUES (auth.uid(), 'test@test.com');

-- 3. "Users can update own profile"
UPDATE profiles SET email = 'new@test.com' WHERE id = auth.uid();
```

### Если политик нет → создай:

```sql
-- Включи RLS:
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Политика для SELECT:
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

-- Политика для INSERT:
CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Политика для UPDATE:
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);
```

---

## ШАГ 4: ЛОКАЛЬНОЕ ТЕСТИРОВАНИЕ (10 мин)

### 1. Запусти локально:

```bash
cd /Users/sanecek/tema/ai-chat-pro
npm run dev
```

### 2. Открой браузер:

```
http://localhost:3000/signup
```

### 3. Попробуй зарегистрироваться:

- Email: `test@example.com`
- Password: `TestPass123`

### 4. Проверь консоль браузера (F12):

- Открой вкладку Console
- Ищи ошибки красным цветом
- Скопируй полный текст ошибки

### 5. Проверь терминал:

- Смотри вывод `npm run dev`
- Ищи ошибки сервера
- Скопируй полный текст ошибки

---

## ШАГ 5: ПРОВЕРКА ЛОГОВ VERCEL (5 мин)

### После деплоя:

1. Vercel Dashboard → Project → Logs
2. Фильтр: `register` или `auth`
3. Время: последние 24 часа
4. Ищи ошибки:
   - `Invalid API key`
   - `Authentication failed`
   - `Database error`
   - `500 Internal Server Error`

### Скопируй последние 20 строк логов

---

## 🎯 ЧАСТЫЕ ОШИБКИ И РЕШЕНИЯ

### Ошибка 1: "Invalid API key"

**Причина:** В `NEXT_PUBLIC_SUPABASE_ANON_KEY` стоит service role key

**Решение:**
1. Открой Supabase Dashboard → Settings → API
2. Скопируй **anon/public key**
3. Вставь в Vercel как `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Redeploy проект

---

### Ошибка 2: "User already exists"

**Причина:** Пользователь уже зарегистрирован

**Решение:**
```sql
-- Проверь в Supabase:
SELECT * FROM auth.users WHERE email = 'test@example.com';

-- Если есть → удали для теста:
DELETE FROM auth.users WHERE email = 'test@example.com';
```

---

### Ошибка 3: "Profile creation failed"

**Причина:** Триггер не работает или RLS блокирует

**Решение:**
1. Проверь триггер (см. ШАГ 2)
2. Проверь RLS policies (см. ШАГ 3)
3. Создай профиль вручную для теста:

```sql
-- Найди user_id:
SELECT id FROM auth.users WHERE email = 'test@example.com';

-- Создай профиль:
INSERT INTO public.profiles (id, email, subscription_tier)
VALUES ('user_id_из_выше', 'test@example.com', 'free');
```

---

### Ошибка 4: "500 Internal Server Error"

**Причина:** Ошибка на сервере

**Решение:**
1. Проверь логи Vercel (см. ШАГ 5)
2. Проверь код регистрации на ошибки
3. Добавь больше логирования:

```typescript
// В src/app/api/auth/register/route.ts добавь:
console.log('Registration attempt:', { email: trimmedEmail });
console.log('Supabase URL:', supabaseUrl);
console.log('Service key exists:', !!serviceRoleKey);
```

---

## 📞 ЕСЛИ НИЧЕГО НЕ ПОМОГАЕТ

### Пришли мне:

1. **Скриншот ошибки из браузера:**
   - F12 → Console → скриншот красных ошибок

2. **Логи из Vercel:**
   - Последние 20 строк из логов

3. **Логи из Supabase:**
   - Dashboard → Logs → API Logs → последние 10 записей

4. **Значения переменных (без секретов):**
   ```
   NEXT_PUBLIC_SUPABASE_URL = есть/нет
   NEXT_PUBLIC_SUPABASE_ANON_KEY = начинается с eyJ... (первые 20 символов)
   SUPABASE_SERVICE_ROLE_KEY = есть/нет
   ```

**Я найду проблему за 5 минут! 🎯**

---

## ✅ ЧЕКЛИСТ

- [ ] Переменные окружения проверены на Vercel
- [ ] NEXT_PUBLIC_SUPABASE_ANON_KEY = anon key (НЕ service role!)
- [ ] Триггер создан в Supabase
- [ ] RLS policies настроены
- [ ] Локальное тестирование пройдено
- [ ] Логи Vercel проверены
- [ ] Ошибка найдена и исправлена
- [ ] Регистрация работает на продакшене

**После выполнения → регистрация должна работать! ✅**

