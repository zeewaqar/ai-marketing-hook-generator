// src/components/ChatSidebar.tsx
import { prisma }                  from '@/lib/db';
import Link                        from 'next/link';
import {
  Command,
  CommandInput,
  CommandList,
  CommandItem,
  CommandEmpty,
} from '@/components/ui/command';
import { ScrollArea }              from '@/components/ui/scroll-area';
import ChatListItem                from '@/components/ChatListItem';
import LogoutButton                from '@/components/LogoutButton';
import { getServerSession }        from 'next-auth/next';
import { authOptions }             from '@/lib/authOptions';
import { Badge }                   from '@/components/ui/badge';

export const dynamic = 'force-dynamic';

export async function ChatSidebar() {
  // 1️⃣ Authenticate
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return null;
  const userId = session.user.id;

  // 2️⃣ Fetch this user's chats AND plan
  type Chat = { id: string | number; title: string };
  const [chats, user] = await Promise.all([
    prisma.chat.findMany({
      where:   { userId },
      orderBy: { createdAt: 'desc' },
      select:  { id: true, title: true },
    }),
    prisma.user.findUnique({
      where:  { id: userId },
      select: { plan: true },
    }),
  ]) as [Chat[], { plan?: string } | null];

  const plan = user?.plan ?? 'FREE';

  return (
    <aside className="w-64 shrink-0 border-r p-4 flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <Link href="/new" className="font-medium text-brand hover:underline">
          + New Hook
        </Link>
        <LogoutButton />
      </div>

      <Command shouldFilter>
        <CommandInput placeholder="Search chats…" />
        <ScrollArea className="h-[calc(100vh-16rem)] pr-1">
          <CommandList>
            {chats.map(({ id, title }) => (
              <CommandItem key={id} value={title} className="px-0 py-1" asChild>
                <ChatListItem id={String(id)} title={title} />
              </CommandItem>
            ))}
            <CommandEmpty>No matches.</CommandEmpty>
          </CommandList>
        </ScrollArea>
      </Command>

      {chats.length === 0 && (
        <p className="text-xs text-muted-foreground mt-2">No chats yet.</p>
      )}

      {/* Plan & upgrade section */}
      <div className="mt-auto pt-4 border-t">
        <p className="text-xs text-muted-foreground mb-2">Your plan:</p>
        <Badge variant={plan === 'PRO' ? 'secondary' : 'outline'}>
          {plan}
        </Badge>
        {plan === 'FREE' && (
          <Link
            href="/billing"
            className="block mt-2 text-sm text-brand hover:underline"
          >
            Upgrade to Pro
          </Link>
        )}
      </div>
    </aside>
  );
}
