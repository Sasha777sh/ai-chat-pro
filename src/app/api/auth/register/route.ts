import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: Request) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceRoleKey) {
      return NextResponse.json(
        { error: 'Supabase credentials are not configured' },
        { status: 500 }
      );
    }

    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email и пароль обязательны' }, { status: 400 });
    }

    const trimmedEmail = String(email).trim().toLowerCase();

    // Проверяем, существует ли пользователь с таким email
    const { data: existingProfile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('id')
      .eq('email', trimmedEmail)
      .maybeSingle();

    if (profileError && profileError.code !== 'PGRST116') {
      return NextResponse.json({ error: profileError.message }, { status: 400 });
    }

    if (existingProfile) {
      return NextResponse.json({ error: 'Пользователь с таким email уже существует' }, { status: 409 });
    }

    // Создаём пользователя с мгновенным подтверждением email
    const { data: createdUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email: trimmedEmail,
      password,
      email_confirm: true,
    });

    if (createError) {
      console.error('User creation error:', createError);
      // Более понятные сообщения об ошибках
      if (createError.message.includes('already registered') || createError.message.includes('already exists')) {
        return NextResponse.json({ error: 'Пользователь с таким email уже существует' }, { status: 409 });
      }
      if (createError.message.includes('Invalid API key') || createError.message.includes('invalid')) {
        return NextResponse.json({ 
          error: 'Ошибка конфигурации сервера. Обратитесь в поддержку.',
          details: process.env.NODE_ENV === 'development' ? createError.message : undefined
        }, { status: 500 });
      }
      return NextResponse.json({ 
        error: createError.message || 'Не удалось создать пользователя',
        details: process.env.NODE_ENV === 'development' ? createError : undefined
      }, { status: 400 });
    }

    if (!createdUser?.user?.id) {
      console.error('User created but no user ID returned');
      return NextResponse.json({ error: 'Пользователь создан, но не удалось получить ID' }, { status: 500 });
    }

    // Явно создаём профиль (на случай, если триггер не сработал)
    const { error: profileCreateError } = await supabaseAdmin
      .from('profiles')
      .upsert(
        {
          id: createdUser.user.id,
          email: trimmedEmail,
          subscription_tier: 'free',
        },
        {
          onConflict: 'id',
        }
      );

    if (profileCreateError) {
      console.error('Profile creation error:', profileCreateError);
      // Не возвращаем ошибку, т.к. пользователь уже создан, профиль может быть создан триггером
      // Но логируем для отладки
    }

    return NextResponse.json({ 
      success: true, 
      userId: createdUser.user.id,
      email: trimmedEmail
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Неизвестная ошибка';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}


