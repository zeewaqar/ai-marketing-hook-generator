// src/app/api/hook/quota/route.ts
import { NextResponse, NextRequest } from 'next/server';
import { getToken }                  from 'next-auth/jwt';
import { prisma }                    from '@/lib/db';
export async function GET(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET! });
  if (!token?.sub) return NextResponse.json({ error:'Unauthenticated' }, { status:401 });
  const userId = token.sub as string;

  const since = new Date(Date.now() - 24*60*60*1000);
  const used  = await prisma.hookLog.count({ where: { userId, createdAt:{ gte: since } } });
  const { plan } = await prisma.user.findUniqueOrThrow({
    where: { id: userId },
    select: { plan: true },
  });

  return NextResponse.json({
    plan,
    used,
    allowed: plan === 'FREE' ? 10 : null,
    reset: since.toISOString(),
  });
}
