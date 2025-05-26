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
    const res = await fetch('/api/billing/upgrade', { method: 'POST' });
    setLoading(false);

    if (res.ok) {
      toast({ title: 'Upgraded to PRO!', variant: 'default' });
      router.refresh();           // refresh sidebar & quota
      router.push('/new');        // back to generator
    } else {
      const err = await res.json();
      toast({ title: 'Upgrade failed', description: err.error, variant: 'destructive' });
    }
  }

  return (
    <main className="max-w-md mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold">Upgrade to Pro</h1>
      <p>
        Get unlimited generations, priority support, and advanced features—all for just $10/month.
      </p>
      <Button onClick={upgrade} disabled={loading}>
        {loading ? 'Upgrading…' : 'Upgrade to Pro'}
      </Button>
    </main>
  );
}
