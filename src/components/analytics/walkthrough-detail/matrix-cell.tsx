import { cn } from '@/lib/utils';
import type { ReviewerChapter } from '@/types/analytics';
import { Check, LoaderCircle } from 'lucide-react';

type CellKind = 'marked' | 'viewed' | 'untouched';

function cellKind(c: ReviewerChapter): CellKind {
  if (c.markedAsRead) return 'marked';
  if (c.viewCount > 0) return 'viewed';
  return 'untouched';
}

export function MatrixCell({ chapter }: { chapter: ReviewerChapter }) {
  const kind = cellKind(chapter);
  if (kind === 'untouched') {
    return (
      <div className="relative mx-auto flex h-9 w-9 items-center justify-center rounded-lg border border-gray-100 bg-gray-50">
        <span className="text-sm text-gray-300">—</span>
      </div>
    );
  }
  return (
    <div className="relative mx-auto h-9 w-9">
      <div
        className={cn(
          'flex h-9 w-9 items-center justify-center rounded-lg border',
          kind === 'marked'
            ? 'border-emerald-200 bg-emerald-50 text-emerald-600'
            : 'border-amber-200 bg-amber-50 text-amber-600'
        )}
      >
        {kind === 'marked' ? <Check className="h-4 w-4" /> : <LoaderCircle className="h-4 w-4" />}
      </div>
      {chapter.commentCount > 0 && (
        <span className="absolute -top-1.5 -right-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-violet-600 px-1 text-[9px] font-semibold text-white">
          {chapter.commentCount}
        </span>
      )}
    </div>
  );
}
