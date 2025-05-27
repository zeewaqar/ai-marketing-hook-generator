// src/app/(main)/billing/page.tsx
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button }    from '@/components/ui/button';
import { useToast }  from '@/hooks/use-toast';

export default function BillingPage() {
  const [loading, setLoading] = useState(false);
  const { toast }            = useToast();
  const router               = useRouter();

  async function upgrade() {
    setLoading(true);
    const res = await fetch('/api/billing/checkout', { method: 'POST' });
    setLoading(false);

    if (res.ok) {
      const { url } = await res.json();
      window.location.href = url;    // redirect to Stripe
    } else {
      toast({ title: 'Could not start checkout.', variant: 'destructive' });
    }
  }

  return (
    <main className="max-w-md mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold">Upgrade to Pro</h1>
      <p>Unlimited generations for $10/month.</p>
      <Button onClick={upgrade} disabled={loading}>
        {loading ? 'Loading…' : 'Upgrade to Pro'}
      </Button>
    </main>
  );
}
