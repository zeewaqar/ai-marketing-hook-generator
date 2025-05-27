// src/app/api/billing/webhook/route.ts
import { NextRequest, NextResponse } from 'next/server';
import Stripe                         from 'stripe';
import { prisma }                    from '@/lib/db';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-04-30.basil',
});
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: NextRequest) {
  const payload = await req.text();
  const sig     = req.headers.get('stripe-signature')!;

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(payload, sig, webhookSecret);
  } catch (err) {
    console.error('Webhook signature mismatch', err);
    return new Response('Webhook Error', { status: 400 });
  }

  // Listen only to subscription completed
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const email   = session.customer_email!;
    // Mark that user as PRO
    await prisma.user.updateMany({
      where: { email },
      data:  { plan: 'PRO' },
    });
  }

  return NextResponse.json({ received: true });
}
