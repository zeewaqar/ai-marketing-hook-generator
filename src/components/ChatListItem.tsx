'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ChatListItem({
  id,
  title,
}: {
  id: string;
  title: string;
}) {
  const router = useRouter();

  async function remove(e: React.MouseEvent) {
    e.preventDefault();
    await fetch(`/api/chat/${id}`, { method: 'DELETE' });
    router.push('/new');
    router.refresh();
  }

  return (
    <div className="flex w-full gap-2">
      {/* title now WRAPS, no ellipsis */}
      <Link
        href={`/chat/${id}`}
        className="flex-1 whitespace-normal break-words pr-10 text-sm hover:underline leading-tight"
      >
        {title || 'Untitled'}
      </Link>

      {/* delete icon always visible */}
      <Button
        size="icon"
        variant="ghost"
        onClick={remove}
        className="shrink-0 h-5 w-5"
      >
        <Trash className="h-4 w-4" />
      </Button>
    </div>
  );
}
