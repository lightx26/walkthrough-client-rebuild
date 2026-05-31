'use client';

import { useEffect } from 'react';

import Link from 'next/link';

import { ServerCrash } from 'lucide-react';

import { Button } from '@/components/ui/button';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex flex-1 items-center justify-center px-6 py-16">
      <div className="max-w-md text-center">
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-100">
          <ServerCrash className="h-6 w-6 text-violet-600" />
        </div>
        <p className="mb-2 text-sm font-medium text-violet-600">500</p>
        <h1 className="mb-2 text-2xl font-bold text-gray-900">Something went wrong</h1>
        <p className="mb-6 text-sm text-gray-500">
          An unexpected error occurred. Please try again.
        </p>
        <div className="flex items-center justify-center gap-2">
          <Button variant="primary" size="sm" onClick={() => reset()}>
            Try again
          </Button>
          <Button asChild variant="primarySoft" size="sm">
            <Link href="/">Back to home</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
