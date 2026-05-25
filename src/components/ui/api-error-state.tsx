"use client";

import Link from "next/link";
import { FileQuestion, Lock, ServerCrash, AlertCircle } from "lucide-react";
import axios from "axios";
import { Button } from "./button";
import { getErrorMessage } from "@/lib/error";

type Variant = "not-found" | "forbidden" | "server-error" | "generic";

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
  "not-found": {
    icon: FileQuestion,
    badge: "404",
    title: "Not found",
    description: (r) =>
      `The ${r} you're looking for doesn't exist or is no longer available.`,
    showRetry: false,
  },
  forbidden: {
    icon: Lock,
    badge: "403",
    title: "Access denied",
    description: (r) => `You don't have permission to view this ${r}.`,
    showRetry: false,
  },
  "server-error": {
    icon: ServerCrash,
    badge: "500",
    title: "Something went wrong",
    description: () =>
      "We hit a snag loading this page. Please try again in a moment.",
    showRetry: true,
  },
  generic: {
    icon: AlertCircle,
    badge: "Error",
    title: "Couldn't load",
    description: () => "An unexpected error occurred while loading this page.",
    showRetry: true,
  },
};

function variantFor(error: unknown): Variant {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status;
    if (status === 404) return "not-found";
    if (status === 403) return "forbidden";
    if (status && status >= 500) return "server-error";
  }
  return "generic";
}

export function ApiErrorState({
  error,
  resource = "page",
  onRetry,
}: ApiErrorStateProps) {
  const variant = variantFor(error);
  const spec = SPECS[variant];
  const Icon = spec.icon;
  const detail = getErrorMessage(error, "");

  return (
    <div className="flex items-center justify-center px-6 py-16 min-h-[60vh]">
      <div className="max-w-md text-center">
        <div className="w-14 h-14 rounded-2xl bg-violet-100 flex items-center justify-center mx-auto mb-5">
          <Icon className="w-6 h-6 text-violet-600" />
        </div>
        <p className="text-sm font-medium text-violet-600 mb-2">{spec.badge}</p>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">{spec.title}</h1>
        <p className="text-sm text-gray-500 mb-6">
          {spec.description(resource)}
          {detail && variant === "generic" ? ` ${detail}` : null}
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
