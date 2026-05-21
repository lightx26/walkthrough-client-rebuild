import { Skeleton } from "@/components/ui";

export function WalkthroughCardSkeleton() {
  return (
    <div className="flex items-center gap-4 p-5 rounded-xl border border-gray-200 bg-white">
      <Skeleton className="w-5 h-5 rounded shrink-0" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-16 rounded-full" />
        <Skeleton className="h-4 w-56" />
        <Skeleton className="h-3 w-40" />
        <Skeleton className="h-3 w-32" />
      </div>
      <Skeleton className="h-9 w-20 rounded-lg shrink-0" />
    </div>
  );
}
