'use client';

import { cn } from '@/lib/utils';
import type { Profile, ProfileStats } from '@/types/profile';
import { Calendar, Link as LinkIcon } from 'lucide-react';

import { UserAvatar } from '@/components/ui';
import { Button } from '@/components/ui/button';

export type ProfileTab = 'overview' | 'walkthroughs' | 'repositories';

interface ProfileHeaderProps {
  profile: Profile;
  stats?: ProfileStats;
  activeTab: ProfileTab;
  onTabChange: (tab: ProfileTab) => void;
}

function formatJoinDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });
}

export function ProfileHeader({ profile, stats, activeTab, onTabChange }: ProfileHeaderProps) {
  const tabs: { id: ProfileTab; label: string; count?: number }[] = [
    { id: 'overview', label: 'Overview' },
    { id: 'walkthroughs', label: 'Walkthroughs' },
    { id: 'repositories', label: 'Repositories' },
  ];

  return (
    <div>
      {/* Banner */}
      <div className="h-24 bg-linear-to-r from-violet-600 via-violet-500 to-indigo-500" />

      {/* Profile info row */}
      <div className="px-8 pt-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-5">
            <div className="-mt-12">
              <UserAvatar
                src={profile.avatarUrl}
                displayName={profile.displayName}
                username={profile.username}
                size="xl"
                ring
              />
            </div>
            <div className="pt-1">
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-gray-900">{profile.displayName}</h1>
                <span className="text-gray-400">@{profile.username}</span>
              </div>
              <div className="mt-1.5 flex items-center gap-4 text-sm text-gray-400">
                <a
                  href={profile.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 transition-colors hover:text-violet-600"
                >
                  <LinkIcon className="h-3.5 w-3.5" />
                  github.com/{profile.username}
                </a>
                <span className="flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" />
                  Joined {formatJoinDate(profile.joinedAt)}
                </span>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-10 pt-1 text-center">
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats?.walkthroughs ?? 0}</p>
              <p className="text-sm text-gray-400">Walkthroughs</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats?.reviews ?? 0}</p>
              <p className="text-sm text-gray-400">Reviews</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-5 flex items-center gap-1 border-b border-gray-200">
          {tabs.map((tab) => (
            <Button
              key={tab.id}
              variant="ghost"
              size="none"
              onClick={() => onTabChange(tab.id)}
              className={cn(
                '-mb-px gap-1.5 rounded-none border-b-2 px-3 py-2 text-sm font-medium hover:bg-transparent',
                activeTab === tab.id
                  ? 'border-primary text-primary'
                  : 'text-muted-foreground hover:text-foreground border-transparent'
              )}
            >
              {tab.label}
              {tab.count != null && (
                <span
                  className={cn(
                    'rounded-full px-1.5 py-0.5 text-xs font-medium',
                    activeTab === tab.id
                      ? 'bg-primary-soft text-primary-soft-foreground'
                      : 'bg-muted text-muted-foreground'
                  )}
                >
                  {tab.count}
                </span>
              )}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
