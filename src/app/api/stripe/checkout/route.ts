import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

// Planos Sense AI — IDs de preço serão criados no Stripe Dashboard
// Substitua pelos Price IDs reais após criar os produtos no Stripe
const PLANOS: Record<string, { priceId: string; nome: string }> = {
  starter:    { priceId: process.env.STRIPE_PRICE_STARTER    || 'price_starter',    nome: 'Sense Starter'    },
  growth:     { priceId: process.env.STRIPE_PRICE_GROWTH     || 'price_growth',     nome: 'Sense Growth'     },
  enterprise: { priceId: process.env.STRIPE_PRICE_ENTERPRISE || 'price_enterprise', nome: 'Sense Enterprise' },
};

export async function POST(req: NextRequest) {
  try {
    const { plano, email, empresaId, userId } = await req.json();

    if (!plano || !email) {
      return NextResponse.json({ error: 'plano e email são obrigatórios' }, { status: 400 });
    }

    const planoConfig = PLANOS[plano];
    if (!planoConfig) {
      return NextResponse.json({ error: 'Plano inválido' }, { status: 400 });
    }

    const origin = req.headers.get('origin') || 'https://rhessencialdigital.com.br';

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      customer_email: email,
      line_items: [
        {
          price: planoConfig.priceId,
          quantity: 1,
        },
      ],
      metadata: {
        empresa_id: empresaId || '',
        user_id: userId || '',
        plano,
      },
      success_url: `${origin}/sense-app?checkout=success&plano=${plano}`,
      cancel_url:  `${origin}/sense-app?checkout=cancelled`,
      locale: 'pt-BR',
    });

    return NextResponse.json({ url: session.url, sessionId: session.id });
  } catch (err: any) {
    console.error('Stripe checkout error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
