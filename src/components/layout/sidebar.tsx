"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart2,
  BookOpen,
  Database,
  Eye,
  GitPullRequest,
  Home,
  LayoutTemplate,
  Star,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/ui/logo";
import { useStarredRepos } from "@/hooks/use-starred";
import { languageColor } from "@/utils/language-color";
import React from "react";

const mainNav = [
  { href: "/", icon: Home, label: "Home" },
  { href: "/walkthroughs", icon: BookOpen, label: "Walkthroughs", count: 23 },
  { href: "/reviewing", icon: Eye, label: "Reviewing", count: 6 },
  { href: "/pulls", icon: GitPullRequest, label: "Pull Requests", count: 11 },
];

const workspaceNav = [
  { href: "/repos", icon: Database, label: "Repositories" },
  { href: "/analytics", icon: BarChart2, label: "Analytics" },
  { href: "/templates", icon: LayoutTemplate, label: "Templates" },
];

export function Sidebar() {
  const pathname = usePathname();
  const { data: starredData } = useStarredRepos();
  const starredRepos = starredData?.data?.items ?? [];

  return (
    <aside className="w-56 shrink-0 flex flex-col border-r border-gray-200 bg-white h-full">
      <div className="flex items-center gap-2.5 px-4 py-4 shrink-0 cursor-pointer">
        <Logo size="sm" />
        <span className="font-semibold text-gray-900 text-sm">Walkthrough</span>
      </div>

      <nav className="flex-1 overflow-y-auto px-2 pb-4">
        <div className="space-y-0.5 mb-5">
          {mainNav.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-2.5 px-3 py-2 rounded-md text-sm transition-colors",
                  isActive
                    ? "bg-violet-50 text-violet-700 font-bold"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                )}
              >
                <item.icon
                  className={cn(
                    "w-4 h-4 shrink-0",
                    isActive ? "text-violet-600 stroke-2" : "text-gray-400",
                  )}
                />
                <span className="flex-1">{item.label}</span>
                {item.count !== undefined && (
                  <span
                    className={cn(
                      "text-xs px-1.5 py-0.5 rounded-full font-medium",
                      isActive
                        ? "bg-violet-100 text-violet-700"
                        : "bg-gray-100 text-gray-500",
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
          <p className="px-3 mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-gray-400">
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
                    "flex items-center gap-2.5 px-3 py-2 rounded-md text-sm transition-colors",
                    isActive
                      ? "bg-violet-50 text-violet-700 font-bold"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                  )}
                >
                  <item.icon
                    className={cn(
                      "w-4 h-4 shrink-0",
                      isActive ? "text-violet-600 stroke-2" : "text-gray-400",
                    )}
                  />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>

        <div>
          <div className="flex items-center px-3 mb-1.5">
            <p className="flex-1 text-[10px] font-semibold uppercase tracking-wider text-gray-400">
              Starred
            </p>
            <Star className="w-3 h-3 text-gray-300" />
          </div>
          <div className="space-y-0.5">
            {starredRepos.map((repo) => (
              <Link
                key={repo.repoFullName}
                href={`/repos/${repo.repoFullName}`}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
              >
                <span
                  className={cn("w-2 h-2 rounded-full shrink-0", languageColor(repo.language ?? ""))}
                />
                <span className="truncate">{repo.repoName}</span>
              </Link>
            ))}
            {starredRepos.length === 0 && (
              <p className="px-3 py-2 text-xs text-gray-400">No starred repos</p>
            )}
          </div>
        </div>
      </nav>
    </aside>
  );
}
