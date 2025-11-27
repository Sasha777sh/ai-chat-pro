import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import Stripe from 'stripe';
import { PLAN_CONFIG, type PlanId } from '@/lib/plans';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

// Ленивая инициализация Stripe (только при необходимости)
function getStripe() {
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
  if (!stripeSecretKey) {
    throw new Error('STRIPE_SECRET_KEY не настроен');
  }
  return new Stripe(stripeSecretKey, {
    apiVersion: '2025-08-27.basil',
  });
}

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ error: 'Не авторизован' }, { status: 401 });
    }

    const token = authHeader.replace('Bearer ', '');
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return NextResponse.json({ error: 'Не авторизован' }, { status: 401 });
    }

    const { planId } = await request.json();

    if (!planId || !['basic', 'plus', 'pro'].includes(planId)) {
      return NextResponse.json({ error: 'Неверный план' }, { status: 400 });
    }

    const plan = PLAN_CONFIG[planId as PlanId];
    const priceId = process.env[plan.stripePriceEnv || ''];

    if (!priceId) {
      return NextResponse.json({ error: 'Цена не настроена' }, { status: 500 });
    }

    const { data: existingSubscription } = await supabase
      .from('billing_subscriptions')
      .select('stripe_customer_id')
      .eq('user_id', user.id)
      .maybeSingle();

    let customerId = existingSubscription?.stripe_customer_id;

    if (!customerId) {
      const stripe = getStripe();
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: { userId: user.id },
      });
      customerId = customer.id;

      await supabase.from('billing_subscriptions').upsert({
        user_id: user.id,
        plan: planId,
        status: 'inactive',
        stripe_customer_id: customerId,
      });
    }

    const stripe = getStripe();
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${appUrl}/account?success=true`,
      cancel_url: `${appUrl}/billing?canceled=true`,
      metadata: {
        userId: user.id,
        planId: planId,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error('Stripe checkout error:', error);
    return NextResponse.json({ error: error.message || 'Ошибка создания сессии' }, { status: 500 });
  }
}

