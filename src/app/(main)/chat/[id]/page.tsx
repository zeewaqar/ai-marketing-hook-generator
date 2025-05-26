// src/app/(main)/chat/[id]/page.tsx
import { prisma }           from '@/lib/db';
import { notFound }         from 'next/navigation';
import { HookTabs }         from '@/components/HookTabs';
import TitleEditor          from '@/components/TitleEditor';
import { getServerSession } from 'next-auth/next';
import { authOptions }      from '@/lib/authOptions';

export default async function ChatPage({ params }: { params: { id: string } }) {
  // Next.js 15 requires awaiting params for dynamic routes
  const { id: chatId } = await params as { id: string };

  // 1️⃣ Authenticate
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) notFound();
  const userId = session.user.id;

  // 2️⃣ Fetch only this user's chat
  const chat = await prisma.chat.findFirst({
    where: { id: chatId, userId },
  });
  if (!chat) notFound();

  // 3️⃣ Server action for renaming the title
  async function rename(id: string, title: string) {
    'use server';
    await prisma.chat.update({ where: { id }, data: { title } });
  }

  return (
    <main className="max-w-4xl mx-auto p-6 space-y-6">
      <TitleEditor id={chat.id} initial={chat.title} rename={rename} />
      <HookTabs data={chat.result as any} />
    </main>
  );
}
