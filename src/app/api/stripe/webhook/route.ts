import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import Stripe from 'stripe';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const stripeSecretKey = process.env.STRIPE_SECRET_KEY!;
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

const stripe = new Stripe(stripeSecretKey, {
  apiVersion: '2025-08-27.basil',
});

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json({ error: 'Нет подписи' }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (error: any) {
    console.error('Webhook signature verification failed:', error.message);
    return NextResponse.json({ error: `Webhook Error: ${error.message}` }, { status: 400 });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.userId;
        const planId = session.metadata?.planId;

        if (!userId || !planId) {
          console.error('Missing metadata in checkout session');
          break;
        }

        const subscriptionResponse = await stripe.subscriptions.retrieve(session.subscription as string);
        const subscription = subscriptionResponse as Stripe.Subscription & { current_period_end?: number };

        await supabase.from('billing_subscriptions').upsert({
          user_id: userId,
          plan: planId,
          status: subscription.status === 'active' ? 'active' : 'inactive',
          stripe_customer_id: subscription.customer as string,
          stripe_subscription_id: subscription.id,
          current_period_end: subscription.current_period_end 
            ? new Date(subscription.current_period_end * 1000).toISOString()
            : null,
        });

        await supabase
          .from('profiles')
          .update({ subscription_tier: planId })
          .eq('id', userId);

        break;
      }

      case 'customer.subscription.updated':
      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription & { current_period_end?: number };
        const customerId = subscription.customer as string;

        const { data: billingSub } = await supabase
          .from('billing_subscriptions')
          .select('user_id')
          .eq('stripe_customer_id', customerId)
          .single();

        if (!billingSub) {
          console.error('Billing subscription not found');
          break;
        }

        if (event.type === 'customer.subscription.deleted') {
          await supabase
            .from('billing_subscriptions')
            .update({
              status: 'inactive',
              current_period_end: null,
            })
            .eq('user_id', billingSub.user_id);

          await supabase
            .from('profiles')
            .update({ subscription_tier: 'free' })
            .eq('id', billingSub.user_id);
        } else {
          await supabase
            .from('billing_subscriptions')
            .update({
              status: subscription.status === 'active' ? 'active' : 'inactive',
              current_period_end: subscription.current_period_end
                ? new Date(subscription.current_period_end * 1000).toISOString()
                : null,
            })
            .eq('user_id', billingSub.user_id);

          if (subscription.status !== 'active') {
            await supabase
              .from('profiles')
              .update({ subscription_tier: 'free' })
              .eq('id', billingSub.user_id);
          }
        }

        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error('Webhook handler error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

