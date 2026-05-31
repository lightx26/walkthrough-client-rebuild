'use client';

import { Suspense, useEffect, useRef } from 'react';

import { useRouter, useSearchParams } from 'next/navigation';

import { Logo } from '@/components/ui';

import { useLoginWithGitHub } from '@/hooks/use-auth';

function CallbackHandler() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const loginMutation = useLoginWithGitHub();
  const called = useRef(false);

  useEffect(() => {
    if (called.current) return;
    called.current = true;

    const code = searchParams.get('code');
    if (!code) {
      router.replace('/login');
      return;
    }

    loginMutation.mutate(code, {
      onSuccess: () => router.replace('/'),
      onError: () => router.replace('/login'),
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return null;
}

export default function AuthCallbackPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="text-center">
        <Logo size="md" className="mx-auto mb-5" />
        <div className="mx-auto mb-3 h-6 w-6 animate-spin rounded-full border-2 border-violet-600 border-t-transparent" />
        <p className="text-sm text-gray-500">Signing you in with GitHub…</p>
        <Suspense>
          <CallbackHandler />
        </Suspense>
      </div>
    </div>
  );
}
