import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const API_URL = 'https://api.yookassa.ru/v3/payments';

function idemKey() {
    return crypto.randomBytes(16).toString('hex');
}

export async function POST(request: NextRequest) {
    try {
        // Получаем токен из заголовков
        const authHeader = request.headers.get('authorization');
        if (!authHeader) {
            return NextResponse.json({ error: 'Не авторизован' }, { status: 401 });
        }

        const token = authHeader.replace('Bearer ', '');
        
        // Для проверки пользовательского токена используем anon key
        const supabaseAuth = createClient(supabaseUrl, supabaseAnonKey);
        const { data: { user }, error: authError } = await supabaseAuth.auth.getUser(token);

        if (authError || !user) {
            console.error('Auth error:', authError);
            return NextResponse.json({ error: authError?.message || 'Не авторизован' }, { status: 401 });
        }
        
        // Для работы с данными используем service role key
        const supabase = createClient(supabaseUrl, supabaseServiceKey);

        const { planId } = await request.json(); // 'basic' | 'plus' | 'pro'
        
        if (!planId || !['basic', 'plus', 'pro'].includes(planId)) {
            return NextResponse.json({ error: 'Неверный тариф' }, { status: 400 });
        }

        // Цены в рублях
        const prices: Record<string, { amount: string; description: string }> = {
            basic: { amount: '1500.00', description: 'EDEM Intelligence - Тариф Basic (1 месяц)' },
            plus: { amount: '2900.00', description: 'EDEM Intelligence - Тариф Plus (1 месяц)' },
            pro: { amount: '4900.00', description: 'EDEM Intelligence - Тариф Pro (1 месяц)' },
        };

        const planInfo = prices[planId];
        if (!planInfo) {
            return NextResponse.json({ error: 'Тариф не найден' }, { status: 400 });
        }

        const payload = {
            amount: {
                value: planInfo.amount,
                currency: 'RUB',
            },
            capture: true,
            confirmation: {
                type: 'redirect',
                return_url: `${process.env.NEXT_PUBLIC_APP_URL}/account?success=true&plan=${planId}`,
            },
            description: planInfo.description,
            metadata: {
                userId: user.id,
                plan: planId,
            },
        };

        const auth = Buffer.from(
            `${process.env.YK_SHOP_ID}:${process.env.YK_SECRET_KEY}`
        ).toString('base64');

        const res = await fetch(API_URL, {
            method: 'POST',
            headers: {
                Authorization: `Basic ${auth}`,
                'Content-Type': 'application/json',
                'Idempotence-Key': idemKey(),
            },
            body: JSON.stringify(payload),
        });

        if (!res.ok) {
            const err = await res.text();
            console.error('YooKassa API error:', err);
            return NextResponse.json({ error: 'Ошибка создания платежа' }, { status: 500 });
        }

        const data = await res.json();
        return NextResponse.json({
            url: data.confirmation?.confirmation_url,
            paymentId: data.id,
        });
    } catch (error: any) {
        console.error('YooKassa checkout error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

