'use client';

import { useState, Suspense } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const plan = searchParams.get('plan');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const validatePassword = (pwd: string): string | null => {
    if (pwd.length < 8) {
      return 'Пароль должен быть не менее 8 символов';
    }
    if (!/[A-Za-z]/.test(pwd)) {
      return 'Пароль должен содержать хотя бы одну букву';
    }
    if (!/[0-9]/.test(pwd)) {
      return 'Пароль должен содержать хотя бы одну цифру';
    }
    return null;
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Валидация пароля
    const passwordError = validatePassword(password);
    if (passwordError) {
      setError(passwordError);
      setLoading(false);
      return;
    }

    // Проверка совпадения паролей
    if (password !== passwordConfirm) {
      setError('Пароли не совпадают');
      setLoading(false);
      return;
    }

    const trimmedEmail = email.trim().toLowerCase();

    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: trimmedEmail,
        password,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      console.error('Signup error:', result);
      // Более понятные сообщения об ошибках
      let errorMessage = result.error || 'Не удалось создать пользователя';

      if (result.error?.includes('already exists') || result.error?.includes('уже существует')) {
        errorMessage = 'Пользователь с таким email уже зарегистрирован. Попробуйте войти.';
      } else if (result.error?.includes('Invalid API key') || result.error?.includes('конфигурации')) {
        errorMessage = 'Ошибка сервера. Пожалуйста, попробуйте позже или обратитесь в поддержку.';
      }

      setError(errorMessage);
      setLoading(false);
      return;
    }

    console.log('Signup success via admin route, userId:', result.userId);

    // Небольшая задержка перед автоматическим входом (даём время на создание профиля)
    await new Promise(resolve => setTimeout(resolve, 500));

    // Пробуем автоматический вход
    let signInAttempts = 0;
    const maxAttempts = 3;
    let signInSuccess = false;

    while (signInAttempts < maxAttempts && !signInSuccess) {
      signInAttempts++;
      console.log(`Auto-login attempt ${signInAttempts}/${maxAttempts}`);

      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: trimmedEmail,
        password,
      });

      if (signInError) {
        console.error(`Auto-login error (attempt ${signInAttempts}):`, signInError);

        // Если это последняя попытка, показываем ошибку
        if (signInAttempts >= maxAttempts) {
          // Не показываем ошибку, просто редиректим на логин с сообщением
          router.push('/login?message=signup-success');
          setLoading(false);
          return;
        }

        // Ждём перед следующей попыткой
        await new Promise(resolve => setTimeout(resolve, 1000));
        continue;
      }

      if (data.session) {
        console.log('Auto-login successful. Redirecting to welcome.');
        localStorage.setItem('onboarding_completed', 'false');
        router.push('/welcome');
        signInSuccess = true;
        setLoading(false);
        return;
      }
    }

    // Если автоматический вход не удался, редиректим на логин
    console.log('Auto-login failed after all attempts. Redirecting to login.');
    router.push('/login?message=signup-success');
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-edem-dark px-4">
      <div className="max-w-md w-full card-edem p-8">
        <h1 className="text-3xl font-bold mb-6 text-center text-edem-main text-glow-edem">Регистрация</h1>
        {plan === 'pro' && (
          <div className="mb-4 p-3 bg-edem-sage/20 border border-edem-sage/50 rounded-lg text-edem-sage text-sm text-center">
            Вы выбрали тариф Pro. После регистрации перейдёте к оплате.
          </div>
        )}
        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <label className="block text-sm mb-2 text-edem-secondary">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 bg-edem-secondary-bg border border-edem-line rounded-lg text-edem-main placeholder:text-edem-muted focus:outline-none focus:border-edem-live"
            />
          </div>
          <div>
            <label className="block text-sm mb-2 text-edem-secondary">Пароль</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              className="w-full px-4 py-3 bg-edem-secondary-bg border border-edem-line rounded-lg text-edem-main placeholder:text-edem-muted focus:outline-none focus:border-edem-live"
              placeholder="Минимум 8 символов, буквы и цифры"
            />
            <p className="text-xs text-edem-muted mt-1">
              Минимум 8 символов, должна быть хотя бы одна буква и одна цифра
            </p>
          </div>
          <div>
            <label className="block text-sm mb-2 text-edem-secondary">Подтвердите пароль</label>
            <input
              type="password"
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
              required
              minLength={8}
              className="w-full px-4 py-3 bg-edem-secondary-bg border border-edem-line rounded-lg text-edem-main placeholder:text-edem-muted focus:outline-none focus:border-edem-live"
            />
          </div>
          {error && (
            <div className="p-3 bg-edem-shadow/20 border border-edem-shadow/50 rounded-lg text-edem-shadow text-sm">
              {error}
            </div>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full px-6 py-3 bg-edem-live hover:bg-edem-live/80 disabled:bg-edem-surface disabled:text-edem-muted text-white font-semibold rounded-lg transition-colors"
          >
            {loading ? 'Регистрация...' : 'Зарегистрироваться'}
          </button>
        </form>
        <p className="mt-6 text-center text-edem-muted">
          Уже есть аккаунт?{' '}
          <Link href="/login" className="text-edem-live hover:text-edem-live/80">
            Войти
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-edem-dark px-4">
        <div className="text-edem-secondary">Загрузка...</div>
      </div>
    }>
      <SignupForm />
    </Suspense>
  );
}


