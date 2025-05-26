'use client';

import { useState }       from 'react';
import { signIn }         from 'next-auth/react';
import { useRouter }      from 'next/navigation';
import { Button }         from '@/components/ui/button';
import { Input }          from '@/components/ui/input';
import { Label }          from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const res = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });
    if (res?.ok) router.push('/new');
    else setError('Invalid credentials');
  }

  return (
    <main className="grid place-items-center h-screen">
      <Card className="w-80">
        <CardHeader>
          <CardTitle>Sign In</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-1">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
            </div>

            <Button type="submit" className="w-full">Sign In</Button>

            <p className="text-center text-sm">
              No account?{' '}
              <Button variant="link" className="p-0">
                <a href="/register">Register</a>
              </Button>
            </p>
          </CardContent>
        </form>
      </Card>
    </main>
  );
}
