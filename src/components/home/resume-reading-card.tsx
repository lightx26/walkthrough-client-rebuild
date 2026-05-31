import Link from 'next/link';

import type { RecentlyReviewedWalkthrough } from '@/types/walkthrough';
import { GitCommit, Play } from 'lucide-react';

interface ResumeReadingCardProps {
  walkthrough: RecentlyReviewedWalkthrough;
}

export function ResumeReadingCard({ walkthrough }: ResumeReadingCardProps) {
  const pct = Math.round((walkthrough.readChapters / walkthrough.totalChapters) * 100);

  return (
    <div className="mb-4 rounded-xl bg-gradient-to-br from-violet-600 via-violet-600 to-indigo-700 p-5 text-white shadow-md shadow-violet-200">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="mb-2 flex items-center gap-2">
            <span className="rounded-full bg-white/20 px-2.5 py-0.5 text-[10px] font-bold tracking-widest uppercase">
              Resume Reading
            </span>
            <span className="text-xs text-violet-200">
              Chapter {walkthrough.readChapters} of {walkthrough.totalChapters}
            </span>
          </div>
          <h3 className="mb-3 pr-2 text-[17px] leading-snug font-semibold">{walkthrough.title}</h3>
          <div className="mb-0.5 flex items-center gap-2">
            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/20">
              <div className="h-full rounded-full bg-white" style={{ width: `${pct}%` }} />
            </div>
            <span className="w-8 shrink-0 text-right text-xs text-violet-200">{pct}%</span>
          </div>
          <p className="mt-2 flex items-center gap-1.5 text-xs text-violet-300">
            <GitCommit className="h-3 w-3 shrink-0" />
            {walkthrough.owner}/{walkthrough.repo} · #{walkthrough.prNumber}
          </p>
        </div>
        <Link
          href={`/walkthroughs/${walkthrough.walkthroughId}`}
          className="flex shrink-0 items-center gap-2 rounded-xl bg-white/15 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-white/25 active:bg-white/30"
        >
          <Play className="h-4 w-4 fill-white" />
          Continue
        </Link>
      </div>
    </div>
  );
}
