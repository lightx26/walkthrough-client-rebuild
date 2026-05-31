'use client';

import { useMemo, useState } from 'react';

import { cn } from '@/lib/utils';
import { Database, Filter, X } from 'lucide-react';

import { DashboardLayout } from '@/components/layout';
import { RepoCard } from '@/components/repos';
import { Pagination, Skeleton } from '@/components/ui';
import { Button } from '@/components/ui/button';

import { useRepositories } from '@/hooks/use-github';

const PER_PAGE = 20;

function RepoCardSkeleton() {
  return (
    <div className="flex items-center gap-5 rounded-xl border border-gray-200 bg-white px-6 py-5">
      <Skeleton className="h-7 w-7 shrink-0 rounded-lg" />
      <div className="min-w-0 flex-1 space-y-2">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-3.5 w-72" />
        <Skeleton className="h-3 w-52" />
      </div>
      <div className="flex shrink-0 items-center gap-8">
        <div className="space-y-1 text-center">
          <Skeleton className="mx-auto h-6 w-6" />
          <Skeleton className="h-3 w-14" />
        </div>
        <div className="space-y-1 text-center">
          <Skeleton className="mx-auto h-6 w-6" />
          <Skeleton className="h-3 w-20" />
        </div>
        <Skeleton className="h-4 w-4" />
      </div>
    </div>
  );
}

type TypeFilter = '' | 'public' | 'private';

export default function RepositoriesPage() {
  const [page, setPage] = useState(1);
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('');
  const [languageFilter, setLanguageFilter] = useState('');
  const [ownerFilter, setOwnerFilter] = useState('');

  const { data, isLoading } = useRepositories({
    page,
    perPage: PER_PAGE,
    type: typeFilter || undefined,
    language: languageFilter || undefined,
  });

  const repos = data?.data?.items ?? [];
  const totalPages = data?.data?.totalPages ?? 1;
  const totalElements = data?.data?.totalElements ?? 0;

  // Extract unique owners from current page for the owner filter dropdown
  const uniqueOwners = useMemo(() => {
    const owners = repos.map((r) => ({
      login: r.owner.login,
      type: r.owner.type,
    }));
    const seen = new Set<string>();
    return owners.filter((o) => {
      if (seen.has(o.login)) return false;
      seen.add(o.login);
      return true;
    });
  }, [repos]);

  // Extract unique languages from current page for the language quick-picks
  const uniqueLanguages = useMemo(() => {
    const langs = repos.map((r) => r.language).filter((l): l is string => !!l);
    return [...new Set(langs)].sort();
  }, [repos]);

  // Client-side owner filter (server filters handle type & language)
  const filteredRepos = ownerFilter ? repos.filter((r) => r.owner.login === ownerFilter) : repos;

  const hasActiveFilters = !!typeFilter || !!languageFilter || !!ownerFilter;

  const clearFilters = () => {
    setTypeFilter('');
    setLanguageFilter('');
    setOwnerFilter('');
    setPage(1);
  };

  return (
    <DashboardLayout>
      <main className="min-w-0 flex-1 overflow-y-auto px-8 py-7">
        <div className="mb-6 flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-violet-600 text-white">
            <Database className="h-5 w-5" />
          </div>
          <div>
            <h1 className="mb-1 text-[22px] font-bold text-gray-900">Repositories</h1>
            <p className="text-sm text-gray-500">
              {isLoading
                ? 'Loading repositories…'
                : `${totalElements} ${totalElements === 1 ? 'repository' : 'repositories'} connected to your account`}
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-5 flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs font-medium text-gray-500">
            <Filter className="h-3.5 w-3.5" />
            Filters
          </div>

          {/* Type filter */}
          <select
            value={typeFilter}
            onChange={(e) => {
              setTypeFilter(e.target.value as TypeFilter);
              setPage(1);
            }}
            className={cn(
              'cursor-pointer rounded-lg border bg-white px-3 py-1.5 text-sm transition-colors outline-none',
              typeFilter
                ? 'border-violet-300 bg-violet-50 text-violet-700'
                : 'border-gray-200 text-gray-600 hover:border-gray-300'
            )}
          >
            <option value="">All types</option>
            <option value="public">Public</option>
            <option value="private">Private</option>
          </select>

          {/* Language filter */}
          <select
            value={languageFilter}
            onChange={(e) => {
              setLanguageFilter(e.target.value);
              setPage(1);
            }}
            className={cn(
              'cursor-pointer rounded-lg border bg-white px-3 py-1.5 text-sm transition-colors outline-none',
              languageFilter
                ? 'border-violet-300 bg-violet-50 text-violet-700'
                : 'border-gray-200 text-gray-600 hover:border-gray-300'
            )}
          >
            <option value="">All languages</option>
            {uniqueLanguages.map((lang) => (
              <option key={lang} value={lang}>
                {lang}
              </option>
            ))}
          </select>

          {/* Owner filter */}
          <select
            value={ownerFilter}
            onChange={(e) => {
              setOwnerFilter(e.target.value);
            }}
            className={cn(
              'cursor-pointer rounded-lg border bg-white px-3 py-1.5 text-sm transition-colors outline-none',
              ownerFilter
                ? 'border-violet-300 bg-violet-50 text-violet-700'
                : 'border-gray-200 text-gray-600 hover:border-gray-300'
            )}
          >
            <option value="">All owners</option>
            {uniqueOwners.map((owner) => (
              <option key={owner.login} value={owner.login}>
                {owner.type === 'Organization' ? `🏢 ${owner.login}` : `👤 ${owner.login}`}
              </option>
            ))}
          </select>

          {hasActiveFilters && (
            <Button
              variant="muted"
              size="none"
              onClick={clearFilters}
              className="ml-1 gap-1 px-2 py-1 text-xs font-normal hover:bg-transparent"
            >
              <X className="h-3 w-3" />
              Clear
            </Button>
          )}
        </div>

        <div className="space-y-3">
          {isLoading ? (
            <>
              <RepoCardSkeleton />
              <RepoCardSkeleton />
              <RepoCardSkeleton />
            </>
          ) : filteredRepos.length === 0 ? (
            <div className="py-16 text-center text-sm text-gray-400">No repositories found.</div>
          ) : (
            filteredRepos.map((repo) => <RepoCard key={repo.id} repo={repo} />)
          )}
        </div>

        {!isLoading && totalPages > 1 && (
          <div className="mt-6 flex justify-center">
            <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
          </div>
        )}
      </main>
    </DashboardLayout>
  );
}
