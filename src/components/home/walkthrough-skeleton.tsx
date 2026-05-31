import { Skeleton } from '@/components/ui';

export function WalkthroughRowSkeleton() {
  return (
    <div className="flex items-start gap-3 border-b border-gray-100 py-3.5 last:border-0">
      <Skeleton className="mt-0.5 h-4 w-4 shrink-0 rounded" />
      <div className="min-w-0 flex-1 space-y-2">
        <Skeleton className="h-4 w-20 rounded-full" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
      </div>
    </div>
  );
}
