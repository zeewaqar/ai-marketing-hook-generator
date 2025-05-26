'use client';

export default function StreamToken({ children }: { children: string }) {
  return (
    <span className="inline-block animate-pulse bg-accent/10 text-accent px-0.5 rounded">
      {children}
    </span>
  );
}
