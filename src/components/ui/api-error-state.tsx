'use client';

import Link from 'next/link';

import { getErrorMessage } from '@/lib/error';
import axios from 'axios';
import { AlertCircle, FileQuestion, Lock, ServerCrash } from 'lucide-react';

import { Button } from './button';

type Variant = 'not-found' | 'forbidden' | 'server-error' | 'generic';

interface ApiErrorStateProps {
  error: unknown;
  resource?: string;
  onRetry?: () => void;
}

interface Spec {
  icon: React.ComponentType<{ className?: string }>;
  badge: string;
  title: string;
  description: (resource: string) => string;
  showRetry: boolean;
}

const SPECS: Record<Variant, Spec> = {
  'not-found': {
    icon: FileQuestion,
    badge: '404',
    title: 'Not found',
    description: (r) => `The ${r} you're looking for doesn't exist or is no longer available.`,
    showRetry: false,
  },
  forbidden: {
    icon: Lock,
    badge: '403',
    title: 'Access denied',
    description: (r) => `You don't have permission to view this ${r}.`,
    showRetry: false,
  },
  'server-error': {
    icon: ServerCrash,
    badge: '500',
    title: 'Something went wrong',
    description: () => 'We hit a snag loading this page. Please try again in a moment.',
    showRetry: true,
  },
  generic: {
    icon: AlertCircle,
    badge: 'Error',
    title: "Couldn't load",
    description: () => 'An unexpected error occurred while loading this page.',
    showRetry: true,
  },
};

function variantFor(error: unknown): Variant {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status;
    if (status === 404) return 'not-found';
    if (status === 403) return 'forbidden';
    if (status && status >= 500) return 'server-error';
  }
  return 'generic';
}

export function ApiErrorState({ error, resource = 'page', onRetry }: ApiErrorStateProps) {
  const variant = variantFor(error);
  const spec = SPECS[variant];
  const Icon = spec.icon;
  const detail = getErrorMessage(error, '');

  return (
    <div className="flex min-h-[60vh] items-center justify-center px-6 py-16">
      <div className="max-w-md text-center">
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-100">
          <Icon className="h-6 w-6 text-violet-600" />
        </div>
        <p className="mb-2 text-sm font-medium text-violet-600">{spec.badge}</p>
        <h1 className="mb-2 text-2xl font-bold text-gray-900">{spec.title}</h1>
        <p className="mb-6 text-sm text-gray-500">
          {spec.description(resource)}
          {detail && variant === 'generic' ? ` ${detail}` : null}
        </p>
        <div className="flex items-center justify-center gap-2">
          {spec.showRetry && onRetry && (
            <Button variant="primary" size="sm" onClick={onRetry}>
              Try again
            </Button>
          )}
          <Button asChild variant="primarySoft" size="sm">
            <Link href="/">Back to home</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

export function isApiErrorOfStatus(error: unknown, status: number): boolean {
  return axios.isAxiosError(error) && error.response?.status === status;
}
