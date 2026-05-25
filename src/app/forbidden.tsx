import Link from "next/link";
import { Lock } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Forbidden() {
  return (
    <main className="flex-1 flex items-center justify-center px-6 py-16">
      <div className="max-w-md text-center">
        <div className="w-14 h-14 rounded-2xl bg-violet-100 flex items-center justify-center mx-auto mb-5">
          <Lock className="w-6 h-6 text-violet-600" />
        </div>
        <p className="text-sm font-medium text-violet-600 mb-2">403</p>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Access denied</h1>
        <p className="text-sm text-gray-500 mb-6">
          You don&apos;t have permission to view this page.
        </p>
        <Button asChild variant="primarySoft" size="sm">
          <Link href="/">Back to home</Link>
        </Button>
      </div>
    </main>
  );
}
