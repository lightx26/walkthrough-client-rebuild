'use client';

import React from 'react';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { cn } from '@/lib/utils';
import {
  BarChart2,
  Database,
  Eye,
  GitPullRequest,
  Home,
  LayoutTemplate,
  Pin,
  Waypoints,
} from 'lucide-react';

import { Logo } from '@/components/ui';

import { usePinnedRepos } from '@/hooks/use-pinned-repo';

import { languageColor } from '@/utils/language-color';

const mainNav = [
  { href: '/', icon: Home, label: 'Home' },
  {
    href: '/walkthroughs',
    icon: Waypoints,
    label: 'Walkthroughs',
    count: 23,
    disabled: true,
  },
  {
    href: '/reviewing',
    icon: Eye,
    label: 'Reviewing',
    count: 6,
    disabled: true,
  },
  {
    href: '/pulls',
    icon: GitPullRequest,
    label: 'Pull Requests',
    count: 11,
    disabled: true,
  },
];

const workspaceNav = [
  { href: '/repos', icon: Database, label: 'Repositories', disabled: false },
  {
    href: '/templates',
    icon: LayoutTemplate,
    label: 'Templates',
    disabled: false,
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const { data: pinnedData } = usePinnedRepos();
  const pinnedRepos = pinnedData?.data?.items ?? [];

  return (
    <aside className="flex h-full w-56 shrink-0 flex-col border-r border-gray-200 bg-white">
      <div className="flex shrink-0 cursor-pointer items-center gap-2.5 px-4 py-4">
        <Logo size="sm" />
        <span className="text-sm font-semibold text-gray-900">Walkthrough</span>
      </div>

      <nav className="flex-1 overflow-y-auto px-2 pb-4">
        <div className="mb-5 space-y-0.5">
          {mainNav.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-2.5 rounded-md px-3 py-2 text-sm transition-colors',
                  isActive
                    ? 'bg-violet-50 font-bold text-violet-700'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                )}
                onClick={(e: React.MouseEvent) => {
                  if (item.disabled) {
                    e.preventDefault();
                  }
                }}
              >
                <item.icon
                  className={cn(
                    'h-4 w-4 shrink-0',
                    isActive ? 'stroke-2 text-violet-600' : 'text-gray-400'
                  )}
                />
                <span className="flex-1">{item.label}</span>
                {item.count !== undefined && (
                  <span
                    className={cn(
                      'rounded-full px-1.5 py-0.5 text-xs font-medium',
                      isActive ? 'bg-violet-100 text-violet-700' : 'bg-gray-100 text-gray-500'
                    )}
                  >
                    {item.count}
                  </span>
                )}
              </Link>
            );
          })}
        </div>

        <div className="mb-5">
          <p className="mb-1.5 px-3 text-[10px] font-semibold tracking-wider text-gray-400 uppercase">
            Workspace
          </p>
          <div className="space-y-0.5">
            {workspaceNav.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-2.5 rounded-md px-3 py-2 text-sm transition-colors',
                    isActive
                      ? 'bg-violet-50 font-bold text-violet-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  )}
                  onClick={(e: React.MouseEvent) => {
                    if (item.disabled) {
                      e.preventDefault();
                    }
                  }}
                >
                  <item.icon
                    className={cn(
                      'h-4 w-4 shrink-0',
                      isActive ? 'stroke-2 text-violet-600' : 'text-gray-400'
                    )}
                  />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>

        <div>
          <div className="mb-1.5 flex items-center px-3">
            <p className="flex-1 text-[10px] font-semibold tracking-wider text-gray-400 uppercase">
              Pinned
            </p>
            <Pin className="h-3 w-3 text-gray-300" />
          </div>
          <div className="space-y-0.5">
            {pinnedRepos.map((repo) => (
              <Link
                key={repo.repoFullName}
                href={`/repos/${repo.repoFullName}`}
                className="flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-sm text-gray-600 transition-colors hover:bg-gray-50 hover:text-gray-900"
              >
                <span
                  className={cn(
                    'h-2 w-2 shrink-0 rounded-full',
                    languageColor(repo.language ?? '')
                  )}
                />
                <span className="truncate">{repo.repoName}</span>
              </Link>
            ))}
            {pinnedRepos.length === 0 && (
              <p className="px-3 py-2 text-xs text-gray-400">No pinned repos</p>
            )}
          </div>
        </div>
      </nav>
    </aside>
  );
}
