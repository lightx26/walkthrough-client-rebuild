import { useState } from 'react';

import Link from 'next/link';

import { cn } from '@/lib/utils';
import type { RecentlyReviewedWalkthrough } from '@/types/walkthrough';
import { MessageSquare, PanelRightClose, PanelRightOpen, Waypoints } from 'lucide-react';

import { Button } from '@/components/ui/button';

interface WeekSummaryPanelProps {
  walkthroughCount: number;
  commentCount: number;
  recentlyReviewed: RecentlyReviewedWalkthrough[];
}

export function WeekSummaryPanel({
  walkthroughCount,
  commentCount,
  recentlyReviewed,
}: WeekSummaryPanelProps) {
  const [collapsed, setCollapsed] = useState(false);

  const summaryData = [
    {
      icon: Waypoints,
      iconColor: 'text-blue-500',
      bg: 'bg-blue-50',
      label: 'Walkthroughs',
      value: walkthroughCount,
    },
    {
      icon: MessageSquare,
      iconColor: 'text-violet-500',
      bg: 'bg-violet-50',
      label: 'Comments',
      value: commentCount,
    },
  ];

  if (collapsed) {
    return (
      <aside className="flex shrink-0 flex-col items-center justify-end border-l border-gray-200 bg-white px-1.5 py-4">
        <Button
          variant="ghost"
          size="iconSm"
          onClick={() => setCollapsed(false)}
          className="text-gray-500"
          aria-label="Expand panel"
        >
          <PanelRightOpen className="h-4 w-4" />
        </Button>
      </aside>
    );
  }

  return (
    <aside className="flex w-70 shrink-0 flex-col overflow-y-auto border-l border-gray-200 bg-white px-5 py-5">
      {/* this week */}
      <div className="mb-7">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-900">This week</h3>
        </div>
        <div className="grid grid-cols-2 gap-2.5">
          {summaryData.map(({ icon: Icon, iconColor, bg, label, value }) => (
            <div key={label} className="rounded-xl border border-gray-100 bg-gray-50 p-3">
              <div className="mb-2 flex items-start justify-between">
                <div className={cn('flex h-7 w-7 items-center justify-center rounded-lg', bg)}>
                  <Icon className={cn('h-3.5 w-3.5', iconColor)} />
                </div>
              </div>
              <p className="mb-1 text-xl leading-none font-bold text-gray-900">{value}</p>
              <p className="text-[11px] text-gray-400">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* recently reviewed */}
      {recentlyReviewed.length > 0 && (
        <div>
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-900">Recently reviewed</h3>
          </div>
          <div className="space-y-3.5">
            {recentlyReviewed.slice(0, 5).map((r) => {
              const pct = Math.round((r.readChapters / r.totalChapters) * 100);
              return (
                <Link
                  key={r.walkthroughId}
                  href={`/walkthroughs/${r.walkthroughId}`}
                  className="-mx-1 flex items-center gap-2.5 rounded-lg px-1 py-0.5 transition-colors hover:bg-gray-50"
                >
                  <div className="min-w-0 flex-1">
                    <div className="mb-1.5 flex items-center justify-between">
                      <p className="truncate text-xs font-medium text-gray-700">{r.title}</p>
                      <p className="ml-2 shrink-0 text-xs text-gray-400">
                        {r.readChapters}/{r.totalChapters} ch
                      </p>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-gray-100">
                      <div
                        className="h-full rounded-full bg-violet-500 transition-all"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* collapse button */}
      <div className="mt-auto flex justify-end">
        <Button
          variant="ghost"
          size="iconSm"
          onClick={() => setCollapsed(true)}
          className="text-gray-500"
          aria-label="Collapse panel"
        >
          <PanelRightClose className="h-4 w-4" />
        </Button>
      </div>
    </aside>
  );
}
