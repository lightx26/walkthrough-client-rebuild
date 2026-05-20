"use client";

import { useState } from "react";
import Link from "next/link";
import { useRepoMetrics } from "@/hooks/use-analytics";
import { usePinnedRepos } from "@/hooks/use-starred";
import { cn } from "@/lib/utils";
import { TeamOverviewCards } from "./team-overview-cards";
import { WeeklyTrendChart } from "./weekly-trend-chart";
import { ReviewsPerMemberChart } from "./reviews-per-member-chart";
import { MemberActivityTable } from "./member-activity-table";

export function TeamLeadView() {
  const { data: pinnedData } = usePinnedRepos();
  const repos = pinnedData?.data?.items ?? [];
  const [selected, setSelected] = useState<string | null>(null);

  const fullName = selected ?? repos[0]?.repoFullName ?? null;
  const [owner, repo] = fullName?.split("/") ?? [];

  const { data, isLoading } = useRepoMetrics({
    owner: owner ?? "",
    repo: repo ?? "",
  });

  const metrics = data?.data;

  if (!fullName) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl p-8 text-center text-sm text-gray-500">
        Pin a repository to see team-level analytics.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {repos.length > 1 && (
        <div className="flex items-center gap-2 flex-wrap">
          {repos.map((r) => {
            const isActive = r.repoFullName === fullName;
            return (
              <button
                key={r.repoFullName}
                onClick={() => setSelected(r.repoFullName)}
                className={cn(
                  "text-xs px-3 py-1.5 rounded-md border",
                  isActive
                    ? "border-violet-200 bg-violet-50 text-violet-700"
                    : "border-gray-200 bg-white text-gray-600 hover:border-gray-300",
                )}
              >
                {r.repoName}
              </button>
            );
          })}
        </div>
      )}

      <div>
        <h2 className="text-base font-semibold text-gray-900 mb-1">
          Team overview
        </h2>
        <p className="text-xs text-gray-500 mb-4">
          Longitudinal trends across{" "}
          <span className="font-medium text-gray-700">
            {metrics?.summary.totalWalkthroughs ?? 0} walkthroughs
          </span>{" "}
          — aggregation is valid at this scale (
          <span className="font-medium text-gray-700">
            {metrics?.summary.totalReviews ?? 0} review sessions
          </span>
          ) ·{" "}
          <Link
            href={`/repos/${owner}/${repo}`}
            className="text-violet-600 hover:underline"
          >
            {fullName}
          </Link>
        </p>

        <TeamOverviewCards metrics={metrics} loading={isLoading} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <WeeklyTrendChart trend={metrics?.trend ?? []} />
        <ReviewsPerMemberChart members={metrics?.members ?? []} />
      </div>

      <MemberActivityTable members={metrics?.members ?? []} />
    </div>
  );
}
