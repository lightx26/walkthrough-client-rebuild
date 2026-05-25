import Link from "next/link";
import { FileQuestion } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="flex-1 flex items-center justify-center px-6 py-16">
      <div className="max-w-md text-center">
        <div className="w-14 h-14 rounded-2xl bg-violet-100 flex items-center justify-center mx-auto mb-5">
          <FileQuestion className="w-6 h-6 text-violet-600" />
        </div>
        <p className="text-sm font-medium text-violet-600 mb-2">404</p>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Page not found
        </h1>
        <p className="text-sm text-gray-500 mb-6">
          The page you&apos;re looking for doesn&apos;t exist, or the resource
          isn&apos;t available on GitHub.
        </p>
        <Button asChild variant="primarySoft" size="sm">
          <Link href="/">Back to home</Link>
        </Button>
      </div>
    </main>
  );
}
