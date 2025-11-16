import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Реквизиты для ручной оплаты (карта Visa Таджикистан)
const MANUAL_PAYMENT_DETAILS = {
  cardNumber: process.env.MANUAL_PAYMENT_CARD || 'XXXX XXXX XXXX XXXX',
  cardHolder: process.env.MANUAL_PAYMENT_NAME || 'Your Name',
  bank: process.env.MANUAL_PAYMENT_BANK || 'Bank Name',
  currency: 'USD',
  note: 'После оплаты отправьте скриншот перевода на email для активации подписки',
};

export async function POST(request: NextRequest) {
  try {
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

    const { planId } = await request.json();

    if (!planId || !['basic', 'plus', 'pro'].includes(planId)) {
      return NextResponse.json({ error: 'Неверный тариф' }, { status: 400 });
    }

    // Цены в USD
    const prices: Record<string, number> = {
      basic: 15,
      plus: 29,
      pro: 49,
    };

    const amount = prices[planId];
    if (!amount) {
      return NextResponse.json({ error: 'Тариф не найден' }, { status: 400 });
    }

    // Создаём запись о платеже в статусе "pending"
    const { data: payment, error: paymentError } = await supabase
      .from('billing_subscriptions')
      .insert({
        user_id: user.id,
        plan: planId,
        status: 'pending',
      })
      .select()
      .single();

    if (paymentError) {
      console.error('Manual payment creation error:', paymentError);
      return NextResponse.json({ error: 'Ошибка создания платежа' }, { status: 500 });
    }

    // Email для отправки скриншота
    const supportEmail = process.env.SUPPORT_EMAIL || 'support@chatedem.com';

    return NextResponse.json({
      success: true,
      paymentId: payment.id,
      amount,
      currency: 'USD',
      cardDetails: {
        cardNumber: MANUAL_PAYMENT_DETAILS.cardNumber,
        cardHolder: MANUAL_PAYMENT_DETAILS.cardHolder,
        bank: MANUAL_PAYMENT_DETAILS.bank,
      },
      instructions: [
        `Переведите ${amount} USD на карту: ${MANUAL_PAYMENT_DETAILS.cardNumber}`,
        `Получатель: ${MANUAL_PAYMENT_DETAILS.cardHolder}`,
        `Банк: ${MANUAL_PAYMENT_DETAILS.bank}`,
        `После оплаты отправьте скриншот перевода на email: ${supportEmail}`,
        `В теме письма укажите: Payment ${payment.id}`,
        `После проверки подписка будет активирована в течение 24 часов`,
      ],
      supportEmail,
    });
  } catch (error: any) {
    console.error('Manual payment error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

