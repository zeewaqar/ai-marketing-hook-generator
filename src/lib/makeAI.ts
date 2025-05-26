import OpenAI from 'openai';

export function makeAI() {
  const provider = process.env.AI_PROVIDER ?? 'groq';
  return provider === 'groq'
    ? new OpenAI({
        apiKey:  process.env.GROQ_API_KEY!,
        baseURL: process.env.AI_BASE_URL ?? 'https://api.groq.com/openai/v1',
      })
    : new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });
}
