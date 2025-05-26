'use client';
import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import  AIInput  from '@/components/AIInput';

export default function NewHookPage() {
  const router = useRouter();
  const [pending, start] = useTransition();

  return (
    <main className="max-w-3xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Generate Marketing Hooks</h1>

      <AIInput
        onDone={(res) =>
          start(() => router.push(`/chat/${res.id}`))
        }
      />

      {pending && (
        <p className="text-muted-foreground">Generating…</p>
      )}
    </main>
  );
}
