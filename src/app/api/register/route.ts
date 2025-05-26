import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) return NextResponse.json({ error: 'exists' }, { status: 409 });

  await prisma.user.create({
    data: { email, password: await bcrypt.hash(password, 10) },
  });

  return NextResponse.json({ ok: true });
}
