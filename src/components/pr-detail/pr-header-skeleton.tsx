import { Skeleton } from '@/components/ui';

export function PrHeaderSkeleton() {
  return (
    <div className="space-y-4 rounded-xl border border-gray-200 bg-white p-6">
      <div className="flex items-center gap-3">
        <Skeleton className="h-7 w-20 rounded-full" />
        <Skeleton className="h-5 w-10" />
      </div>
      <Skeleton className="h-7 w-3/4" />
      <div className="flex items-center gap-2">
        <Skeleton className="h-6 w-6 rounded-full" />
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-5 w-40 rounded" />
      </div>
      <div className="flex items-center gap-4">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-4 w-12" />
        <Skeleton className="h-4 w-12" />
      </div>
    </div>
  );
}
