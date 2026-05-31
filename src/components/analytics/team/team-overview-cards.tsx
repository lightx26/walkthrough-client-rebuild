import { cn } from '@/lib/utils';
import type { RepoMetrics } from '@/types/analytics';
import { CheckCircle2, Clock, Users, Waypoints } from 'lucide-react';

function formatDuration(sec: number): string {
  if (!sec) return '0m';
  if (sec < 60) return `${sec}s`;
  const m = Math.round(sec / 60);
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  return `${h}h ${m % 60}m`;
}

function pct(rate: number): string {
  return `${Math.round(rate * 100)}%`;
}

export function TeamOverviewCards({
  metrics,
  loading,
}: {
  metrics: RepoMetrics | undefined;
  loading: boolean;
}) {
  const s = metrics?.summary;
  const cards = [
    {
      icon: CheckCircle2,
      iconBg: 'bg-emerald-50',
      iconColor: 'text-emerald-600',
      label: 'Avg completion rate',
      value: s ? pct(s.avgCompletionRate) : '—',
      hint: s ? `across ${s.totalReviews} review sessions` : null,
    },
    {
      icon: Clock,
      iconBg: 'bg-violet-50',
      iconColor: 'text-violet-600',
      label: 'Avg time to complete',
      value: s ? formatDuration(s.avgTimeToCompleteSec) : '—',
      hint: s ? `${s.totalWalkthroughs} walkthroughs` : null,
    },
    {
      icon: Waypoints,
      iconBg: 'bg-violet-50',
      iconColor: 'text-violet-600',
      label: 'Avg chapters / walkthrough',
      value: s ? s.avgChaptersPerWalkthrough.toFixed(1) : '—',
      hint: 'last 30 days',
    },
    {
      icon: Users,
      iconBg: 'bg-amber-50',
      iconColor: 'text-amber-600',
      label: 'Active reviewers',
      value: s ? String(s.activeReviewers) : '—',
      hint: 'last 30 days',
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((c) => (
        <div
          key={c.label}
          className="flex items-start gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3.5"
        >
          <div
            className={cn('flex h-9 w-9 shrink-0 items-center justify-center rounded-lg', c.iconBg)}
          >
            <c.icon className={cn('h-4 w-4', c.iconColor)} />
          </div>
          <div className="min-w-0">
            <p className="mb-0.5 text-[11px] text-gray-500">{c.label}</p>
            <p className="text-xl leading-tight font-bold text-gray-900">
              {loading ? '…' : c.value}
            </p>
            {c.hint && <p className="mt-0.5 text-[11px] text-gray-400">{c.hint}</p>}
          </div>
        </div>
      ))}
    </div>
  );
}
