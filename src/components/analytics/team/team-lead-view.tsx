'use client';

import { useState } from 'react';

import Link from 'next/link';

import { cn } from '@/lib/utils';

import { Button } from '@/components/ui/button';

import { useRepoMetrics } from '@/hooks/use-analytics';
import { usePinnedRepos } from '@/hooks/use-pinned-repo';

import { MemberActivityTable } from './member-activity-table';
import { ReviewsPerMemberChart } from './reviews-per-member-chart';
import { TeamOverviewCards } from './team-overview-cards';
import { WeeklyTrendChart } from './weekly-trend-chart';

interface TeamLeadViewProps {
  scopedRepo?: { owner: string; repo: string };
}

export function TeamLeadView({ scopedRepo }: TeamLeadViewProps = {}) {
  const { data: pinnedData } = usePinnedRepos();
  const repos = pinnedData?.data?.items ?? [];
  const [selected, setSelected] = useState<string | null>(null);

  const scopedFullName = scopedRepo ? `${scopedRepo.owner}/${scopedRepo.repo}` : null;
  const fullName = scopedFullName ?? selected ?? repos[0]?.repoFullName ?? null;
  const [owner, repo] = fullName?.split('/') ?? [];

  const { data, isLoading } = useRepoMetrics({
    owner: owner ?? '',
    repo: repo ?? '',
  });

  const metrics = data?.data;

  if (!fullName) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-8 text-center text-sm text-gray-500">
        Pin a repository to see team-level analytics.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {!scopedRepo && repos.length > 1 && (
        <div className="flex flex-wrap items-center gap-2">
          {repos.map((r) => {
            const isActive = r.repoFullName === fullName;
            return (
              <Button
                key={r.repoFullName}
                variant={isActive ? 'primarySoft' : 'outline'}
                size="xs"
                onClick={() => setSelected(r.repoFullName)}
                className={cn(isActive && 'border-primary-soft border')}
              >
                {r.repoName}
              </Button>
            );
          })}
        </div>
      )}

      <div>
        <h2 className="mb-1 text-base font-semibold text-gray-900">Team overview</h2>
        <p className="mb-4 text-xs text-gray-500">
          Longitudinal trends across{' '}
          <span className="font-medium text-gray-700">
            {metrics?.summary.totalWalkthroughs ?? 0} walkthroughs
          </span>{' '}
          — aggregation is valid at this scale (
          <span className="font-medium text-gray-700">
            {metrics?.summary.totalReviews ?? 0} review sessions
          </span>
          ) ·{' '}
          <Link href={`/repos/${owner}/${repo}`} className="text-violet-600 hover:underline">
            {fullName}
          </Link>
        </p>

        <TeamOverviewCards metrics={metrics} loading={isLoading} />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <WeeklyTrendChart trend={metrics?.trend ?? []} />
        <ReviewsPerMemberChart members={metrics?.members ?? []} />
      </div>

      <MemberActivityTable members={metrics?.members ?? []} />
    </div>
  );
}
