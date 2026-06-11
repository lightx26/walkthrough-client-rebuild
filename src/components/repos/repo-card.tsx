import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { cn } from '@/lib/utils';
import type { Repository } from '@/types/github';
import {
  BarChart2,
  Building2,
  ChevronRight,
  Database,
  GitBranch,
  GitFork,
  Globe,
  Lock,
  Pin,
  Star,
  User,
} from 'lucide-react';

import { Button } from '@/components/ui/button';

import { usePinRepo, useUnpinRepo } from '@/hooks/use-pinned-repo';

import { formatRelativeTime } from '@/utils/date-diff';
import { languageColor } from '@/utils/language-color';

export function RepoCard({ repo }: { repo: Repository }) {
  const router = useRouter();
  const isPinned = repo.pinned;
  const pinMutation = usePinRepo();
  const unpinMutation = useUnpinRepo();

  const handleTogglePin = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isPinned) {
      unpinMutation.mutate(repo.fullName);
    } else {
      pinMutation.mutate({
        repoFullName: repo.fullName,
        repoName: repo.name,
        language: repo.language,
      });
    }
  };

  const isOrg = repo.owner.type === 'Organization';

  return (
    <Link
      href={`/repos/${repo.owner.login}/${repo.name}`}
      className="group flex cursor-pointer items-center gap-5 rounded-xl border border-gray-200 bg-white px-6 py-5 transition-all hover:border-gray-300 hover:shadow-sm"
    >
      <div className="shrink-0">
        <div className="flex size-9 items-center justify-center rounded-lg bg-violet-50">
          <Database className="size-4 text-violet-600" strokeWidth={2} />
        </div>
      </div>

      <div className="min-w-0 flex-1">
        <h3 className="mb-1.5 truncate text-sm font-semibold text-violet-600 hover:underline">
          <span className="mr-1.5 inline-flex items-center gap-1 align-middle text-[11px] font-medium text-gray-500">
            {isOrg ? (
              <Building2 className="h-3 w-3 text-gray-400" />
            ) : (
              <User className="h-3 w-3 text-gray-400" />
            )}
            {repo.owner.login}
            <span className="text-gray-300">/</span>
          </span>
          {repo.name}
          {repo.isPrivate ? (
            <span className="ml-2 inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 align-middle text-[11px] font-medium text-amber-700">
              <Lock className="h-3 w-3" />
              Private
            </span>
          ) : (
            <span className="ml-2 inline-flex items-center gap-1 rounded-full border border-gray-200 bg-gray-50 px-2 py-0.5 align-middle text-[11px] font-medium text-gray-500">
              <Globe className="h-3 w-3" />
              Public
            </span>
          )}
        </h3>
        {repo.description && (
          <p className="mb-2 truncate text-sm text-gray-500">{repo.description}</p>
        )}
        <div className="flex flex-wrap items-center gap-3 text-xs text-gray-400">
          {repo.language && (
            <span className="flex items-center gap-1.5">
              <span
                className={`h-2.5 w-2.5 shrink-0 rounded-full ${languageColor(repo.language)}`}
              />
              {repo.language}
            </span>
          )}
          <span className="flex items-center gap-1">
            <Star className="h-3 w-3" />
            {repo.stargazersCount}
          </span>
          <span className="flex items-center gap-1">
            <GitFork className="h-3 w-3" />
            {repo.forksCount}
          </span>
          <span>Updated {formatRelativeTime(repo.updatedAt)}</span>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-8">
        <Button
          variant="ghost"
          size="none"
          onClick={handleTogglePin}
          className={cn(
            'p-1.5 hover:bg-transparent',
            isPinned
              ? 'text-violet-500 hover:text-violet-600'
              : 'text-gray-300 hover:text-violet-400'
          )}
          title={isPinned ? 'Unpin repository' : 'Pin repository'}
        >
          <Pin className={cn('h-4 w-4', isPinned && 'fill-current')} />
        </Button>
        <div className="text-center">
          <p className="text-xl font-bold text-gray-900">{repo.openPrsCount}</p>
          <p className="text-xs text-gray-400">open PRs</p>
        </div>
        <div className="text-center">
          <p className="text-xl font-bold text-gray-900">{repo.walkthroughsCount}</p>
          <p className="text-xs text-gray-400">walkthroughs</p>
        </div>
        <ChevronRight className="h-4 w-4 text-gray-300 transition-colors group-hover:text-gray-400" />
      </div>
    </Link>
  );
}
