import { getServerSession } from 'next-auth/next';
import { authOptions }        from '@/lib/authOptions';

interface SessionUser {
  id: string;
  [key: string]: any;
}

interface Session {
  user?: SessionUser;
  [key: string]: any;
}

export async function getSessionUser() {
    const session = await getServerSession(authOptions) as Session;
  if (!session?.user?.id) throw new Error('Unauthenticated');
  return session.user;
}
