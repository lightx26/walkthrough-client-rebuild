'use client';

import { useEffect } from 'react';

import { useRouter } from 'next/navigation';

import { useAuthIsLoading, useIsAuthenticated } from '@/hooks/use-auth';

import { Navbar } from './navbar';
import { Sidebar } from './sidebar';

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useIsAuthenticated();
  const isLoading = useAuthIsLoading();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-violet-600 border-t-transparent" />
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <Navbar />
        <div className="flex min-h-0 flex-1">{children}</div>
      </div>
    </div>
  );
}
