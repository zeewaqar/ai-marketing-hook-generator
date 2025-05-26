'use client';

import { useState, useTransition, useEffect } from 'react';
import { useRouter }                          from 'next/navigation';
import { Button }                             from '@/components/ui/button';
import { Input }                              from '@/components/ui/input';
import { useToast }                           from '@/hooks/use-toast';
import StreamToken                            from '@/components/stream-token';
import { ToastAction } from './ui/toast';

type Quota = { used: number; allowed: number | null; reset: string };

export default function AIInput({ onDone }: { onDone: (d: any) => void }) {
  const [text, setText]     = useState('');
  const [stream, setStrm]   = useState('');
  const [pending, start]    = useTransition();
  const [quota, setQuota]   = useState<Quota | null>(null);
  const { toast }           = useToast();
  const router              = useRouter();

  // ➊ load quota on mount
  useEffect(() => {
    fetch('/api/hook/quota')
      .then(r => r.ok ? r.json() : Promise.reject())
      .then((q: Quota) => setQuota(q))
      .catch(() => {/* ignore */});
  }, []);

  const exceeded = quota
    ? (quota.allowed !== null && quota.used >= quota.allowed)
    : false;
    
  async function submit() {
    if (!text || exceeded) return;
    setStrm('');

    start(async () => {
      const res = await fetch('/api/hook/stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({ prompt: text }),
      });

      // ➋ handle quota‐exceeded
      if (res.status === 429) {
        const err = await res.json();
        toast({
          title: 'Daily limit reached',
          description: `You’ve used ${err.used}/${err.allowed}. Try again after ${new Date(err.reset).toLocaleTimeString()}.`,
          action: (
            <ToastAction altText="Upgrade" onClick={() => router.push('/billing')}>
              Upgrade
            </ToastAction>
          ),
          variant: 'destructive',
        });
        return;
      }

      if (!res.ok) {
        toast({ title: `Error ${res.status}`, variant: 'destructive' });
        return;
      }

      const chatId = res.headers.get('X-Chat-Id');
      if (!chatId) {
        toast({ title: 'No chat ID returned', variant: 'destructive' });
        return;
      }

      // ➌ stream tokens live
      const reader  = res.body!.getReader();
      const decoder = new TextDecoder();
      let full = '';

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value);
        full += chunk;
        setStrm(prev => prev + chunk);
      }

      // ➍ parse & finish
      let data;
      try {
        data = JSON.parse(full);
      } catch {
        toast({ title: 'Invalid JSON from AI', variant: 'destructive' });
        return;
      }

      onDone({ id: chatId, ...data });
      setText('');
      router.push(`/chat/${chatId}`);
      router.refresh();
    });
  }

  return (
    <>
      {quota && quota.allowed !== Infinity && (
        <p className="text-xs text-muted-foreground mb-1">
          {quota.used} / {quota.allowed} used today
        </p>
      )}

      <div className="flex gap-2 mb-2">
        <Input
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Describe your product…"
          className="flex-1"
        />
        <Button onClick={submit} disabled={pending || !!exceeded}>
          {exceeded ? 'Upgrade to PRO' : pending ? '…' : 'Generate'}
        </Button>
      </div>

      {stream && (
        <div className="border rounded p-2 text-sm whitespace-pre-wrap">
          {stream.split(/\s+/).map((t, i) => (
            <StreamToken key={i}>{`${t} `}</StreamToken>
          ))}
        </div>
      )}
    </>
  );
}
