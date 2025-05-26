// src/app/(main)/layout.tsx
import {ChatSidebar} from '@/components/ChatSidebar';
import { ReactNode } from 'react';

export const metadata = {
  title: 'Marketing Hook Generator',
};

export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen">
      {/* ← Sidebar takes up a fixed width */}
      <ChatSidebar />

      {/* ← Main content scrolls */}
      <div className="flex-1 overflow-auto">
        {children}
      </div>
    </div>
  );
}
