import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

const IPN_SECRET = process.env.CRYPTO_IPN_SECRET || '';

export async function POST(request: NextRequest) {
    try {
        const body = await request.text();
        const signature = request.headers.get('x-ipn-signature');

        // Проверяем подпись webhook'а
        if (!signature || !IPN_SECRET) {
            console.error('IPN: Missing signature or secret');
            return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
        }

        // Валидируем подпись
        const expectedSignature = crypto
            .createHmac('sha256', IPN_SECRET)
            .update(body)
            .digest('hex');

        if (signature !== expectedSignature) {
            console.error('IPN: Invalid signature');
            return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
        }

        // Парсим данные
        const data = JSON.parse(body);
        console.log('IPN received:', data);

        // Проверяем статус платежа
        if (data.status === 'completed' || data.status === 'confirmed') {
            await processSuccessfulPayment(data);
        }

        return NextResponse.json({ status: 'ok' });
    } catch (error: any) {
        console.error('IPN error:', error);
        return NextResponse.json({ error: 'Internal error' }, { status: 500 });
    }
}

async function processSuccessfulPayment(data: any) {
    try {
        const { order_id, customer_email, userId } = data;

        // Находим пользователя
        let user;
        if (userId) {
            const { data: userData } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', userId)
                .single();
            user = userData;
        } else if (customer_email) {
            const { data: userData } = await supabase
                .from('profiles')
                .select('*')
                .eq('email', customer_email)
                .single();
            user = userData;
        }

        if (!user) {
            console.error('IPN: User not found for payment:', { order_id, customer_email });
            return;
        }

        const planId = data.plan || data.planId || 'pro'; // Получаем план из данных платежа
        const days = 30; // 1 месяц подписки

        // Обновляем профиль пользователя
        const { error: profileError } = await supabase
            .from('profiles')
            .update({
                subscription_tier: planId,
            })
            .eq('id', user.id);

        if (profileError) {
            console.error('IPN: Profile update error:', profileError);
        }

        // Обновляем или создаём запись в billing_subscriptions
        const { error: billingError } = await supabase
            .from('billing_subscriptions')
            .upsert({
                user_id: user.id,
                plan: planId,
                status: 'active',
                current_period_end: new Date(
                    Date.now() + days * 24 * 60 * 60 * 1000
                ).toISOString(),
            }, {
                onConflict: 'user_id',
            });

        if (billingError) {
            console.error('IPN: Billing update error:', billingError);
        }

        if (!profileError && !billingError) {
            console.log(`IPN: Payment processed successfully for user ${user.id}, plan: ${planId}`);
        }
    } catch (error) {
        console.error('IPN: Error processing payment:', error);
    }
}

