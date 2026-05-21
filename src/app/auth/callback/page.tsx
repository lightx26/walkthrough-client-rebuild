"use client";

import { Suspense, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useLoginWithGitHub } from "@/hooks/use-auth";
import { Logo } from "@/components/ui";

function CallbackHandler() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const loginMutation = useLoginWithGitHub();
  const called = useRef(false);

  useEffect(() => {
    if (called.current) return;
    called.current = true;

    const code = searchParams.get("code");
    if (!code) {
      router.replace("/login");
      return;
    }

    loginMutation.mutate(code, {
      onSuccess: () => router.replace("/"),
      onError: () => router.replace("/login"),
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return null;
}

export default function AuthCallbackPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <Logo size="md" className="mx-auto mb-5" />
        <div className="w-6 h-6 border-2 border-violet-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-gray-500 text-sm">Signing you in with GitHub…</p>
        <Suspense>
          <CallbackHandler />
        </Suspense>
      </div>
    </div>
  );
}
