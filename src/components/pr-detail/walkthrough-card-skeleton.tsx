import { Skeleton } from '@/components/ui';

export function WalkthroughCardSkeleton() {
  return (
    <div className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-5">
      <Skeleton className="h-5 w-5 shrink-0 rounded" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-16 rounded-full" />
        <Skeleton className="h-4 w-56" />
        <Skeleton className="h-3 w-40" />
        <Skeleton className="h-3 w-32" />
      </div>
      <Skeleton className="h-9 w-20 shrink-0 rounded-lg" />
    </div>
  );
}
