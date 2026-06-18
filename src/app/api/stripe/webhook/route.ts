import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig  = req.headers.get('stripe-signature') || '';
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let event: any;

  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err: any) {
    console.error('Webhook signature failed:', err.message);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        const { empresa_id, plano } = session.metadata || {};
        if (empresa_id && plano) {
          await supabase
            .from('sense_empresas')
            .update({
              plano,
              stripe_customer_id: session.customer,
              stripe_subscription_id: session.subscription,
              ativo: true,
            })
            .eq('id', empresa_id);
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const sub = event.data.object;
        await supabase
          .from('sense_empresas')
          .update({ plano: 'starter', ativo: false })
          .eq('stripe_subscription_id', sub.id);
        break;
      }

      case 'customer.subscription.updated': {
        const sub = event.data.object;
        const priceId = sub.items?.data?.[0]?.price?.id || '';
        const planoMap: Record<string, string> = {
          [process.env.STRIPE_PRICE_STARTER    || 'price_starter']:    'starter',
          [process.env.STRIPE_PRICE_GROWTH     || 'price_growth']:     'growth',
          [process.env.STRIPE_PRICE_ENTERPRISE || 'price_enterprise']: 'enterprise',
        };
        const novoPlano = planoMap[priceId];
        if (novoPlano) {
          await supabase
            .from('sense_empresas')
            .update({ plano: novoPlano })
            .eq('stripe_subscription_id', sub.id);
        }
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (err: any) {
    console.error('Webhook handler error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
