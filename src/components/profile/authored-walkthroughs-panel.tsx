'use client';

import type { WalkthroughSummary } from '@/types/walkthrough';
import { ChevronRight } from 'lucide-react';

import { WalkthroughCard } from '@/components/home';
import { Skeleton } from '@/components/ui';
import { Button } from '@/components/ui/button';

interface AuthoredWalkthroughsPanelProps {
  walkthroughs?: WalkthroughSummary[];
  total?: number;
  isLoading: boolean;
  onViewAll: () => void;
}

export function AuthoredWalkthroughsPanel({
  walkthroughs,
  isLoading,
  onViewAll,
}: AuthoredWalkthroughsPanelProps) {
  const preview = walkthroughs?.slice(0, 3) ?? [];

  return (
    <div className="rounded-lg border border-gray-200 bg-white">
      <div className="flex items-center justify-between p-5">
        <h2 className="text-sm font-semibold text-gray-900">Authored walkthroughs</h2>
        <Button
          variant="link"
          size="none"
          onClick={onViewAll}
          className="gap-0.5 text-xs no-underline hover:no-underline"
        >
          View all <ChevronRight className="h-3.5 w-3.5" />
        </Button>
      </div>

      {isLoading ? (
        <div className="mt-3 space-y-4">
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      ) : preview.length === 0 ? (
        <p className="mt-4 text-sm text-gray-400">No walkthroughs yet.</p>
      ) : (
        <div>
          {preview.map((wt) => (
            <WalkthroughCard key={wt.id} wt={wt} />
          ))}
        </div>
      )}
    </div>
  );
}
