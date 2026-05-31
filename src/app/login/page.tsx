'use client';

import { useEffect } from 'react';

import { useRouter } from 'next/navigation';

import { Github, ShieldCheck, Users, Zap } from 'lucide-react';

import { Logo } from '@/components/ui';
import { Button } from '@/components/ui/button';

import { useAuthIsLoading, useIsAuthenticated } from '@/hooks/use-auth';

function handleGitHubLogin() {
  const clientId = process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID;
  const redirectUri = process.env.NEXT_PUBLIC_GITHUB_REDIRECT_URI;
  const scope = 'read:user,user:email,repo';
  window.location.href = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri ?? '')}&scope=${scope}`;
}

const features = [
  { icon: Zap, label: 'Fast reviews' },
  { icon: Users, label: 'Collaborative' },
  { icon: ShieldCheck, label: 'Secure' },
];

export default function LoginPage() {
  const isAuthenticated = useIsAuthenticated();
  const isLoading = useAuthIsLoading();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push('/');
    }
  }, [isLoading, isAuthenticated, router]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#f0f2f5] px-4">
      <div className="w-full max-w-md">
        <div className="overflow-hidden rounded-2xl bg-white shadow-lg">
          <div className="h-1.5 bg-linear-to-r from-violet-500 via-purple-500 to-pink-500" />

          <div className="flex flex-col items-center px-10 pt-10 pb-8">
            <Logo size="lg" className="mb-5" />

            <h1 className="mb-1 text-2xl font-bold text-gray-900">Walkthrough</h1>
            <p className="mb-8 text-sm text-gray-500">Code review, made collaborative</p>

            <div className="mb-6 text-center">
              <h2 className="mb-1 text-lg font-semibold text-gray-900">Sign in to your account</h2>
              <p className="text-sm text-gray-400">Connect via GitHub to get started</p>
            </div>

            <Button variant="secondary" size="cta" onClick={handleGitHubLogin} className="gap-2.5">
              <Github className="h-5 w-5" />
              Sign in with GitHub
            </Button>

            <div className="mt-6 grid w-full grid-cols-3 gap-3">
              {features.map(({ icon: Icon, label }) => (
                <div
                  key={label}
                  className="flex flex-col items-center gap-2 rounded-xl border border-gray-100 bg-gray-50 px-2 py-3.5"
                >
                  <Icon className="h-5 w-5 text-violet-500" strokeWidth={1.75} />
                  <span className="text-xs font-medium text-gray-500">{label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="px-10 pb-8 text-center">
            <p className="text-xs leading-relaxed text-gray-400">
              By signing in, you agree to our{' '}
              <a href="#" className="text-violet-600 hover:underline">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="#" className="text-violet-600 hover:underline">
                Privacy Policy
              </a>
            </p>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-gray-400">
          Walkthrough · Code Review &amp; Walkthrough Management
        </p>
      </div>
    </div>
  );
}
