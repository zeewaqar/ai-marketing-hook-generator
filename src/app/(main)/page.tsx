'use client';
import { useTransition, useState } from 'react';
import { useRouter } from 'next/navigation';
import  AIInput  from '@/components/AIInput';

export default function NewChatPage() {
  const router = useRouter();
  const [pending, start] = useTransition();

  return (
    <main className="max-w-3xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">New Marketing Hook</h1>
      <AIInput
        onDone={(res: { id: any; }) =>
          start(() => router.push(`/chat/${res.id}`))
        }
      />
      {pending && <p className="text-muted-foreground">Generating…</p>}
    </main>
  );
}
