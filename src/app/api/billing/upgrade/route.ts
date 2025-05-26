// src/app/api/billing/upgrade/route.ts
import { NextResponse, NextRequest } from 'next/server';
import { getServerSession }         from 'next-auth/next';
import { authOptions }              from '@/lib/authOptions';
import { prisma }                   from '@/lib/db';

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 });
  }

  const userId = session.user.id;
  try {
    await prisma.user.update({
      where: { id: userId },
      data:  { plan: 'PRO' },
    });
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: 'Could not upgrade' }, { status: 500 });
  }
}
