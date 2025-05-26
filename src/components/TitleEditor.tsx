'use client';
import { useState, useTransition } from 'react';

export default function TitleEditor({
  id,
  initial,
  rename,
}: {
  id: string;
  initial: string;
  rename: (id: string, title: string) => Promise<void>;
}) {
  const [title, setTitle] = useState(initial);
  const [pending, start] = useTransition();

  return (
    <input
      className="text-2xl font-bold w-full outline-none bg-transparent"
      value={title}
      disabled={pending}
      onChange={(e) => setTitle(e.target.value)}
      onBlur={() =>
        title !== initial &&
        start(async () => {
          await rename(id, title);
        })
      }
    />
  );
}
