// src/app/(main)/billing/success/page.tsx
'use client';
import { useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Badge }      from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export default function SuccessPage() {
  const params = useSearchParams();
  const router = useRouter();
  const sessionId = params.get('session_id');

  useEffect(() => {
    if (sessionId) {
      // Optionally fetch session details, then refresh app
      router.refresh();
    }
  }, [sessionId, router]);

  return (
    <main className="max-w-md mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold">Thank you!</h1>
      <p>Your payment was successful. You now have <Badge>PRO</Badge> access.</p>
      <Button onClick={() => router.push('/new')}>Back to Generator</Button>
    </main>
  );
}
