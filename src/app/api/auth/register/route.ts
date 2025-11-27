import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: Request) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    // Детальное логирование для отладки
    console.log('[REGISTER] Starting registration process');
    console.log('[REGISTER] Supabase URL:', supabaseUrl ? '✅ Set' : '❌ Missing');
    console.log('[REGISTER] Service Role Key:', serviceRoleKey ? '✅ Set (length: ' + serviceRoleKey.length + ')' : '❌ Missing');

    if (!supabaseUrl || !serviceRoleKey) {
      console.error('[REGISTER] Missing Supabase credentials');
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
    console.log('[REGISTER] Processing email:', trimmedEmail);

    // Проверяем, существует ли пользователь с таким email
    console.log('[REGISTER] Checking existing profile...');
    const { data: existingProfile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('id')
      .eq('email', trimmedEmail)
      .maybeSingle();

    if (profileError && profileError.code !== 'PGRST116') {
      console.error('[REGISTER] Profile check error:', profileError);
      return NextResponse.json({ error: profileError.message }, { status: 400 });
    }

    if (existingProfile) {
      console.log('[REGISTER] User already exists');
      return NextResponse.json({ error: 'Пользователь с таким email уже существует' }, { status: 409 });
    }

    console.log('[REGISTER] No existing user found, creating new user...');

    // Создаём пользователя с мгновенным подтверждением email
    console.log('[REGISTER] Calling Supabase admin.createUser...');
    const { data: createdUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email: trimmedEmail,
      password,
      email_confirm: true,
    });

    if (createError) {
      console.error('[REGISTER] User creation error:', {
        message: createError.message,
        status: createError.status,
        name: createError.name,
      });
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
      console.error('[REGISTER] User created but no user ID returned');
      console.error('[REGISTER] Created user data:', JSON.stringify(createdUser, null, 2));
      return NextResponse.json({ error: 'Пользователь создан, но не удалось получить ID' }, { status: 500 });
    }

    console.log('[REGISTER] User created successfully, ID:', createdUser.user.id);

    // Явно создаём профиль (на случай, если триггер не сработал)
    console.log('[REGISTER] Creating profile...');
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
      console.error('[REGISTER] Profile creation error:', profileCreateError);
      // Не возвращаем ошибку, т.к. пользователь уже создан, профиль может быть создан триггером
      // Но логируем для отладки
    } else {
      console.log('[REGISTER] Profile created successfully');
    }

    console.log('[REGISTER] Registration completed successfully');
    return NextResponse.json({
      success: true,
      userId: createdUser.user.id,
      email: trimmedEmail
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Неизвестная ошибка';
    console.error('[REGISTER] Unexpected error:', {
      message,
      stack: error instanceof Error ? error.stack : undefined,
    });
    return NextResponse.json({ error: message }, { status: 500 });
  }
}


