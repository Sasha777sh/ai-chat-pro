'use client';

import { useState, useEffect, Suspense } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const msg = searchParams.get('message');
    if (msg === 'check-email') {
      setMessage('Проверьте email для подтверждения регистрации');
    } else if (msg === 'signup-success') {
      setMessage('Регистрация успешна. Теперь войдите, чтобы продолжить.');
    }
  }, [searchParams]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!password || password.length < 6) {
      setError('Пароль должен быть не менее 6 символов');
      setLoading(false);
      return;
    }

    const trimmedEmail = email.trim().toLowerCase();
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email: trimmedEmail,
      password,
    });

    if (error) {
      console.error('Login error:', error);
      // Более понятные сообщения об ошибках
      if (error.message.includes('Invalid login credentials') || error.message.includes('Invalid')) {
        setError('Неверный email или пароль. Проверьте правильность введённых данных.');
      } else if (error.message.includes('Email not confirmed') || error.message.includes('email_not_confirmed')) {
        setError('Email не подтверждён. Проверьте почту и перейдите по ссылке подтверждения.');
      } else if (error.message.includes('Invalid API key') || error.message.includes('invalid')) {
        setError('Ошибка сервера. Пожалуйста, попробуйте позже или обратитесь в поддержку.');
      } else {
        setError(error.message || 'Ошибка входа. Попробуйте ещё раз.');
      }
      setLoading(false);
      return;
    }

    console.log('Login data:', { user: data.user?.id, session: !!data.session });

    if (data.session) {
      // Проверяем redirect параметр
      const redirect = searchParams.get('redirect');
      if (redirect) {
        router.push(redirect);
      } else {
        // Проверяем, проходил ли пользователь онбординг
        const onboardingCompleted = localStorage.getItem('onboarding_completed');
        if (onboardingCompleted === 'true') {
          router.push('/chat');
        } else {
          router.push('/welcome');
        }
      }
    } else {
      console.error('No session after login');
      setError('Не удалось создать сессию. Попробуйте ещё раз.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-edem-dark px-4">
      <div className="max-w-md w-full card-edem p-8">
        <h1 className="text-3xl font-bold mb-6 text-center text-edem-main text-glow-edem">Вход</h1>
        {message && (
          <div className="mb-4 p-3 bg-edem-live/20 border border-edem-live/50 rounded-lg text-edem-live text-sm text-center">
            {message}
          </div>
        )}
        <form onSubmit={handleLogin} className="space-y-4">
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
            {loading ? 'Вход...' : 'Войти'}
          </button>
        </form>
        <p className="mt-6 text-center text-edem-muted">
          Нет аккаунта?{' '}
          <Link href="/signup" className="text-edem-live hover:text-edem-live/80">
            Зарегистрироваться
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-edem-dark px-4">
        <div className="text-edem-secondary">Загрузка...</div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}


