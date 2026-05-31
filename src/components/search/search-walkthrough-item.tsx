import { cn } from '@/lib/utils';
import type { SearchHit } from '@/types/search';
import { ArrowRight, Waypoints } from 'lucide-react';

import { Button } from '@/components/ui/button';

import { formatRelativeTime } from '@/utils/date-diff';

function statusBadgeClass(status: string) {
  switch (status.toLowerCase()) {
    case 'published':
      return 'bg-green-100 text-green-700';
    case 'draft':
      return 'bg-amber-100 text-amber-700';
    default:
      return 'bg-gray-100 text-gray-500';
  }
}

function HighlightedTitle({ html, fallback }: { html?: string; fallback: string }) {
  if (html) {
    return (
      <span
        className="[&_mark]:bg-transparent [&_mark]:font-semibold [&_mark]:text-indigo-600"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  }

  return <span>{fallback}</span>;
}

interface SearchWalkthroughItemProps {
  hit: SearchHit;
  selected: boolean;
  onClick: () => void;
}

export function SearchWalkthroughItem({ hit, selected, onClick }: SearchWalkthroughItemProps) {
  return (
    <Button
      variant="ghost"
      size="none"
      onClick={onClick}
      className={cn(
        'group w-full justify-start gap-3 rounded-none px-4 py-2.5 text-left font-normal',
        selected ? 'bg-indigo-50 hover:bg-indigo-50' : 'hover:bg-gray-50'
      )}
    >
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-indigo-100">
        <Waypoints className="h-4 w-4 text-indigo-600" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm text-gray-900">
          <HighlightedTitle html={hit.highlights?.title?.[0]} fallback={hit.title} />
        </p>
        <p className="truncate text-xs text-gray-400">{hit.repoFull}</p>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <span className="text-xs text-gray-400">{formatRelativeTime(hit.createdAt)}</span>
        <span
          className={cn('rounded px-1.5 py-0.5 text-xs font-medium', statusBadgeClass(hit.status))}
        >
          {hit.status.toLowerCase()}
        </span>
        <ArrowRight
          className={cn(
            'h-3.5 w-3.5 text-gray-400 transition-opacity',
            selected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
          )}
        />
      </div>
    </Button>
  );
}
