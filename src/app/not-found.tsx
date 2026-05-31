import Link from 'next/link';

import { FileQuestion } from 'lucide-react';

import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <main className="flex flex-1 items-center justify-center px-6 py-16">
      <div className="max-w-md text-center">
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-100">
          <FileQuestion className="h-6 w-6 text-violet-600" />
        </div>
        <p className="mb-2 text-sm font-medium text-violet-600">404</p>
        <h1 className="mb-2 text-2xl font-bold text-gray-900">Page not found</h1>
        <p className="mb-6 text-sm text-gray-500">
          The page you&apos;re looking for doesn&apos;t exist.
        </p>
        <Button asChild variant="primarySoft" size="sm">
          <Link href="/">Back to home</Link>
        </Button>
      </div>
    </main>
  );
}
