// src/lib/authOptions.ts
import { PrismaAdapter }    from '@next-auth/prisma-adapter';
import CredentialsProvider  from 'next-auth/providers/credentials';
import bcrypt               from 'bcryptjs';
import { prisma }           from '@/lib/db';

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  session: { strategy: 'jwt' as const },
  providers: [
    CredentialsProvider({
      name: 'Email & Password',
      credentials: {
        email:    { label: 'Email',    type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(creds) {
        if (!creds) return null;
        const user = await prisma.user.findUnique({
          where: { email: creds.email },
        });
        if (!user) return null;
        const valid = await bcrypt.compare(creds.password, user.password);
        return valid ? user : null;
      },
    }),
  ],
  pages: { signIn: '/login' },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    // Add user.id into the JWT on sign in
    async jwt({ token, user }: { token: any; user?: any }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    // Copy token.id into session.user.id for RSCs
    async session({ session, token }: { session: any; token: any }) {
      if (session.user && token.id) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
};
