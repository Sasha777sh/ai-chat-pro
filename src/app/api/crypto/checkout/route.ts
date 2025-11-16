import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

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

        // Цены в USD (для крипты)
        const prices: Record<string, { amount: number; description: string }> = {
            basic: { amount: 15, description: 'EDEM Intelligence - Basic Plan (1 month)' },
            plus: { amount: 29, description: 'EDEM Intelligence - Plus Plan (1 month)' },
            pro: { amount: 49, description: 'EDEM Intelligence - Pro Plan (1 month)' },
        };

        const planInfo = prices[planId];
        if (!planInfo) {
            return NextResponse.json({ error: 'Тариф не найден' }, { status: 400 });
        }

        // Сохраняем информацию о платеже для отслеживания
        const orderId = crypto.randomUUID();

        // Сохраняем заказ в базе для отслеживания
        try {
            await supabase.from('billing_subscriptions').insert({
                user_id: user.id,
                plan: planId,
                status: 'pending',
            });
        } catch (err) {
            // Игнорируем ошибку если запись уже есть
            console.log('Billing subscription already exists or error:', err);
        }

        // Здесь должна быть интеграция с криптоплатежами (например, NOWPayments, CoinGate, BTCPay)
        // Для примера возвращаем URL для оплаты
        // В реальности здесь будет вызов API криптоплатежного сервиса

        return NextResponse.json({
            orderId,
            planId,
            amount: planInfo.amount,
            currency: 'USD',
            paymentUrl: `https://crypto-payment-gateway.com/pay?order=${orderId}&amount=${planInfo.amount}&currency=USD&plan=${planId}`,
            message: 'Используйте предоставленный URL для оплаты криптовалютой',
        });
    } catch (error: any) {
        console.error('Crypto checkout error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

