// src/app/api/hook/stream/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { makeAI } from '@/lib/makeAI';
import { prisma } from '@/lib/db';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
    // 1️⃣ Auth
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET! });
    if (!token?.sub) {
        return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 });
    }
    const userId = token.sub as string;

    // 2️⃣ Quota
    const { plan } = await prisma.user.findUniqueOrThrow({
        where: { id: userId },
        select: { plan: true },
    });
    if (plan === 'FREE') {
        const since = new Date(Date.now() - 24 * 60 * 60 * 1000);
        const used = await prisma.hookLog.count({
            where: { userId, createdAt: { gte: since } },
        });
        // before reserving the chat
        if (used >= 10) {
            // tell the client “no stream, here’s the error”
            return new Response(JSON.stringify({
                error: 'quota_exceeded',
                used,
                allowed: 10,
                reset: since.toISOString(),
            }), {
                status: 429,
                headers: { 'Content-Type': 'application/json' },
            });
        }

    }

    // 3️⃣ Reserve the Chat
    const placeholder = await prisma.chat.create({
        data: { userId, title: '', prompt: '', result: {} },
    });

    // 4️⃣ Kick off streaming AI call
    const { prompt, lang = 'en' } = await req.json();
    const ai = makeAI();
    const completion = await ai.chat.completions.create({
        model: 'llama-3.3-70b-versatile',
        temperature: 0.7,
        stream: true,
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

    // 5️⃣ Stream tokens & build the full JSON string
    let full = '';
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
        async start(controller) {
            for await (const chunk of completion) {
                const token = chunk.choices[0].delta?.content || '';
                full += token;
                controller.enqueue(encoder.encode(token));
            }

            // 6️⃣ Now that we have the complete JSON, parse & normalize
            let data: any;
            try {
                data = JSON.parse(full.trim());
            } catch (e) {
                console.error('Invalid JSON from AI:', full);
                controller.close();
                return;
            }
            data.copy ??= {};
            data.copy.cta = Array.isArray(data.copy.cta) ? data.copy.cta : [];
            data.copy.instagram ??= { caption: '', hashtags: [] };
            data.copy.instagram.hashtags = Array.isArray(data.copy.instagram.hashtags)
                ? data.copy.instagram.hashtags
                : [];
            data.seo ??= {};
            data.seo.keywords = Array.isArray(data.seo.keywords)
                ? data.seo.keywords
                : [];



            // 7️⃣ Update the same Chat record with real values
            await prisma.chat.update({
                where: { id: placeholder.id },
                data: {
                    title: data.seo.title || 'Untitled',
                    prompt,
                    result: data,
                },
            });

            // 8️⃣ Log for quota tracking
            await prisma.hookLog.create({
                data: { userId, prompt, result: data },
            });

            // 9️⃣ Only now close the stream
            controller.close();
        },
    });

    // 🔟 Return the streaming response + Chat-ID header
    return new Response(stream, {
        headers: {
            'Content-Type': 'application/json; charset=utf-8',
            'X-Chat-Id': placeholder.id,
        },
    });
}
