'use client';
import { useToast } from '@/hooks/use-toast';   // NEW
import { Button } from '@/components/ui/button';
import { Copy } from 'lucide-react';

export default function TextareaWithCopy({
  label,
  text,
}: {
  label: string;
  text: string;
}) {
  const { toast } = useToast();                        // NEW

  async function copy() {
    await navigator.clipboard.writeText(text);
    toast({ title: 'Copied to clipboard!' });          // toast pops
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">{label}</h3>
        <Button size="icon" variant="ghost" onClick={copy}>
          <Copy className="h-4 w-4" />
        </Button>
      </div>
      <textarea
        readOnly
        value={text}
        className="w-full h-40 resize-none rounded p-3 bg-slate-50 dark:bg-slate-900 text-sm"
      />
    </div>
  );
}
