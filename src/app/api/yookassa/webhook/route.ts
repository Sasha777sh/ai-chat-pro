import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const evt = body.event as string;
        const obj = body.object || {};

        if (evt === 'payment.succeeded') {
            const userId = obj.metadata?.userId as string | undefined;
            const planId = obj.metadata?.plan as 'basic' | 'plus' | 'pro' | undefined;

            if (userId && planId && ['basic', 'plus', 'pro'].includes(planId)) {
                const days = 30; // 1 месяц подписки

                // Обновляем профиль пользователя
                const { error: profileError } = await supabase
                    .from('profiles')
                    .update({
                        subscription_tier: planId,
                    })
                    .eq('id', userId);

                if (profileError) {
                    console.error('YooKassa webhook error updating profile:', profileError);
                }

                // Обновляем или создаём запись в billing_subscriptions
                const { error: billingError } = await supabase
                    .from('billing_subscriptions')
                    .upsert({
                        user_id: userId,
                        plan: planId,
                        status: 'active',
                        current_period_end: new Date(
                            Date.now() + days * 24 * 60 * 60 * 1000
                        ).toISOString(),
                    }, {
                        onConflict: 'user_id',
                    });

                if (billingError) {
                    console.error('YooKassa webhook error updating billing:', billingError);
                }

                if (!profileError && !billingError) {
                    console.log(`YooKassa payment successful for user ${userId}, plan: ${planId}`);
                }
            }
        }

        return NextResponse.json({ ok: true });
    } catch (error: any) {
        console.error('YooKassa webhook error:', error);
        return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
    }
}

