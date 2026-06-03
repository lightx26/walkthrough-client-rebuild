'use client';

import { Suspense, useState } from 'react';

import { useSearchParams } from 'next/navigation';

import { BarChart2, Users, Waypoints } from 'lucide-react';

import { AnalyticsTabButton, AuthorView, TeamLeadView } from '@/components/analytics';
import { DashboardLayout } from '@/components/layout';
import { ApiErrorState } from '@/components/ui';

import { useRepository } from '@/hooks/use-github';

type Tab = 'author' | 'team';

function AnalyticsContent() {
  const [tab, setTab] = useState<Tab>('author');
  const searchParams = useSearchParams();
  const owner = searchParams.get('owner') ?? undefined;
  const repo = searchParams.get('repo') ?? undefined;
  const scopedRepo = owner && repo ? { owner, repo } : undefined;

  const { error: scopedRepoError, refetch: refetchScopedRepo } = useRepository(
    owner ?? '',
    repo ?? ''
  );

  if (scopedRepo && scopedRepoError) {
    return (
      <DashboardLayout>
        <main className="min-w-0 flex-1 overflow-y-auto px-8 py-7">
          <ApiErrorState
            error={scopedRepoError}
            resource="repository"
            onRetry={() => refetchScopedRepo()}
          />
        </main>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <main className="min-w-0 flex-1 overflow-y-auto px-8 py-7">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-100">
            <BarChart2 className="h-4 w-4 text-violet-600" />
          </div>
          <h1 className="text-[22px] font-bold text-gray-900">
            Analytics
            {scopedRepo && (
              <span className="ml-2 text-sm font-medium text-gray-500">
                · {scopedRepo.owner}/{scopedRepo.repo}
              </span>
            )}
          </h1>
        </div>

        <div className="mb-6 inline-flex items-center p-1">
          <AnalyticsTabButton
            active={tab === 'author'}
            onClick={() => setTab('author')}
            icon={<Waypoints className="h-3.5 w-3.5" />}
            label="Author view"
          />
          <AnalyticsTabButton
            active={tab === 'team'}
            onClick={() => setTab('team')}
            icon={<Users className="h-3.5 w-3.5" />}
            label="Team lead view"
          />
        </div>

        {tab === 'author' ? (
          <AuthorView scopedRepo={scopedRepo} />
        ) : (
          <TeamLeadView scopedRepo={scopedRepo} />
        )}
      </main>
    </DashboardLayout>
  );
}

export default function AnalyticsPage() {
  return (
    <Suspense>
      <AnalyticsContent />
    </Suspense>
  );
}
