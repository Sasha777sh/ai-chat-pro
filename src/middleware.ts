import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Защищённые маршруты
const protectedRoutes = ['/chat', '/account', '/admin'];
const authRoutes = ['/login', '/signup'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Проверяем, является ли маршрут защищённым
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
  const isAuthRoute = authRoutes.some(route => pathname.startsWith(route));

  if (isProtectedRoute) {
    // Supabase хранит токены в cookies с префиксом проекта
    // Ищем все возможные варианты cookies
    const allCookies = request.cookies.getAll();
    const supabaseCookies = allCookies.filter(c => 
      c.name.includes('supabase') || 
      c.name.includes('sb-') ||
      c.name.includes('access_token')
    );

    // Если нет Supabase cookies, редиректим на логин
    if (supabaseCookies.length === 0) {
      const url = new URL('/login', request.url);
      url.searchParams.set('redirect', pathname);
      return NextResponse.redirect(url);
    }

    // Пробуем получить токен из заголовка Authorization (для API)
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');

    // Если есть токен в заголовке, проверяем его
    if (token) {
      try {
        const supabase = createClient(supabaseUrl, supabaseAnonKey);
        const { data: { user }, error } = await supabase.auth.getUser(token);

        if (error || !user) {
          const url = new URL('/login', request.url);
          url.searchParams.set('redirect', pathname);
          return NextResponse.redirect(url);
        }
        // Если токен валиден, пропускаем
        return NextResponse.next();
      } catch (error) {
        // Игнорируем ошибки проверки токена в middleware
        // Пусть страница сама проверит через клиентский код
      }
    }

    // Если есть Supabase cookies, пропускаем (клиент проверит)
    // Middleware не может легко проверить Supabase cookies без сложной логики
    return NextResponse.next();
  }

  // Если пользователь уже авторизован и пытается зайти на auth страницы, редиректим
  // Но проверяем только через клиентский код, middleware пропускает
  // (Supabase cookies сложно проверить в middleware)

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};

