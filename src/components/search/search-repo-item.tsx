import { cn } from '@/lib/utils';
import type { Repository } from '@/types/github';
import { ArrowRight, GitFork, Lock } from 'lucide-react';

import { HighlightText } from '@/components/search';
import { Button } from '@/components/ui/button';

interface Props {
  repo: Repository;
  query: string;
  selected: boolean;
  onClick: () => void;
}

export function SearchRepoItem({ repo, query, selected, onClick }: Props) {
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
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-blue-100">
        <GitFork className="h-4 w-4 text-blue-600" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="flex items-center gap-1.5 truncate text-sm text-gray-900">
          {repo.isPrivate && <Lock className="h-3 w-3 shrink-0 text-gray-400" />}
          <HighlightText text={repo.fullName} query={query} />
        </p>
        {repo.description && <p className="truncate text-xs text-gray-400">{repo.description}</p>}
      </div>
      <div className="flex shrink-0 items-center gap-2">
        {repo.language && (
          <span className="rounded bg-gray-100 px-1.5 py-0.5 text-xs font-medium text-gray-500">
            {repo.language}
          </span>
        )}
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
