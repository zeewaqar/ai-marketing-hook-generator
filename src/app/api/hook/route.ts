// src/app/api/hook/route.ts
export const runtime = 'nodejs'; // so we can use Prisma

import { NextResponse, NextRequest } from 'next/server';
import { getToken }                  from 'next-auth/jwt';
import { makeAI }                    from '@/lib/makeAI';
import { prisma }                    from '@/lib/db';

export async function POST(req: NextRequest) {
  // 1️⃣ Authenticate
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });
  if (!token?.sub) {
    return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 });
  }
  const userId = token.sub as string;

  // 2️⃣ FREE‐tier quota check
  const { plan } = await prisma.user.findUniqueOrThrow({
    where: { id: userId },
    select: { plan: true },
  });
  if (plan === 'FREE') {
    const since = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const count = await prisma.hookLog.count({
      where: { userId, createdAt: { gte: since } },
    });
    if (count >= 10) {
      return NextResponse.json({ error: 'quota_exceeded' }, { status: 429 });
    }
  }

  // 3️⃣ Call the AI in a blocking fashion
  const { prompt, lang = 'en' } = await req.json();
  const ai = makeAI();
  const completion = await ai.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    temperature: 0.7,
    messages: [
      {
        role: 'system',
        content: `You are a senior SaaS marketer.
Return *exactly* this JSON schema:

seo:{title,meta_desc,keywords[],og_title,og_desc,og_image,twitter_title,twitter_desc},
copy:{cta[],tweet,linkedin,facebook,instagram:{caption,hashtags[]}}`,
      },
      { role: 'user', content: `${prompt}\nLanguage: ${lang}` },
    ],
    response_format: { type: 'json_object' },
  });

  // 4️⃣ Parse & normalize
  const raw = completion.choices[0].message.content?.trim() || '{}';
  let data: any;
  try {
    data = JSON.parse(raw);
  } catch {
    console.error('AI returned non-JSON:', raw);
    return NextResponse.json({ error: 'bad_ai' }, { status: 502 });
  }
  data.copy ??= {};
  data.copy.cta = Array.isArray(data.copy.cta) ? data.copy.cta : [];
  data.copy.instagram ??= { caption: '', hashtags: [] };
  data.copy.instagram.hashtags = Array.isArray(data.copy.instagram.hashtags)
    ? data.copy.instagram.hashtags
    : [];
  data.seo ??= {};
  data.seo.keywords = Array.isArray(data.seo.keywords) ? data.seo.keywords : [];

  // 5️⃣ Persist chat (tied to the user) and log generation
  const chat = await prisma.chat.create({
    data: {
      userId,
      title:  data.seo.title || 'Untitled',
      prompt,
      result: data,
    },
    select: { id: true },
  });
  await prisma.hookLog.create({
    data: { userId, prompt, result: data },
  });

  // 6️⃣ Return the full payload with the new ID
  return NextResponse.json({ id: chat.id, ...data });
}
