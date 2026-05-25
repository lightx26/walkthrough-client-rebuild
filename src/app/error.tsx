"use client";

import { useEffect } from "react";
import Link from "next/link";
import { ServerCrash } from "lucide-react";
import { Button } from "@/components/ui/button";

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
    <main className="flex-1 flex items-center justify-center px-6 py-16">
      <div className="max-w-md text-center">
        <div className="w-14 h-14 rounded-2xl bg-violet-100 flex items-center justify-center mx-auto mb-5">
          <ServerCrash className="w-6 h-6 text-violet-600" />
        </div>
        <p className="text-sm font-medium text-violet-600 mb-2">500</p>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Something went wrong
        </h1>
        <p className="text-sm text-gray-500 mb-6">
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
