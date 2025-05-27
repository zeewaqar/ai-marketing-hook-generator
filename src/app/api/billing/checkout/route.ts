// src/app/api/billing/checkout/route.ts
import { NextRequest, NextResponse } from 'next/server';
import Stripe                         from 'stripe';
import { getServerSession }          from 'next-auth/next';
import { authOptions }               from '@/lib/authOptions';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-04-30.basil',
});

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 });
  }

  const origin = req.headers.get('origin')!;
  const stripeSession = await stripe.checkout.sessions.create({
    mode: 'subscription',
    customer_email: session.user.email || undefined,
    line_items: [
      { price: 'price_XXXXXXXX', quantity: 1 } // replace with your Price ID
    ],
    success_url: `${origin}/billing/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/billing`,
  });

  return NextResponse.json({ url: stripeSession.url });
}
