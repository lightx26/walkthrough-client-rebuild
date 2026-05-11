"use client";

import { Calendar, Link as LinkIcon } from "lucide-react";
import { UserAvatar } from "@/components/ui/user-avatar";
import { cn } from "@/lib/utils";
import type { Profile, ProfileStats } from "@/types/profile";

export type ProfileTab = "overview" | "walkthroughs" | "repositories";

interface ProfileHeaderProps {
  profile: Profile;
  stats?: ProfileStats;
  activeTab: ProfileTab;
  onTabChange: (tab: ProfileTab) => void;
}

function formatJoinDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
}

export function ProfileHeader({
  profile,
  stats,
  activeTab,
  onTabChange,
}: ProfileHeaderProps) {
  const tabs: { id: ProfileTab; label: string; count?: number }[] = [
    { id: "overview", label: "Overview" },
    { id: "walkthroughs", label: "Walkthroughs", count: stats?.walkthroughs },
    { id: "repositories", label: "Repositories" },
  ];

  return (
    <div>
      {/* Banner */}
      <div className="h-24 bg-gradient-to-r from-violet-600 via-violet-500 to-indigo-500" />

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
                <h1 className="text-xl font-bold text-gray-900">
                  {profile.displayName}
                </h1>
                <span className="text-gray-400">@{profile.username}</span>
              </div>
              <div className="flex items-center gap-4 mt-1.5 text-sm text-gray-400">
                <a
                  href={profile.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 hover:text-violet-600 transition-colors"
                >
                  <LinkIcon className="w-3.5 h-3.5" />
                  github.com/{profile.username}
                </a>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  Joined {formatJoinDate(profile.joinedAt)}
                </span>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-10 text-center pt-1">
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {stats?.walkthroughs ?? 0}
              </p>
              <p className="text-sm text-gray-400">Walkthroughs</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {stats?.reviews ?? 0}
              </p>
              <p className="text-sm text-gray-400">Reviews</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 mt-5 border-b border-gray-200">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                "flex items-center gap-1.5 px-3 py-2 text-sm font-medium border-b-2 -mb-px transition-colors",
                activeTab === tab.id
                  ? "border-violet-600 text-violet-600"
                  : "border-transparent text-gray-500 hover:text-gray-700",
              )}
            >
              {tab.label}
              {tab.count != null && (
                <span
                  className={cn(
                    "text-xs px-1.5 py-0.5 rounded-full font-medium",
                    activeTab === tab.id
                      ? "bg-violet-100 text-violet-700"
                      : "bg-gray-100 text-gray-500",
                  )}
                >
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
