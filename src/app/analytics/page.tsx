"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { BarChart2, Waypoints, Users } from "lucide-react";
import { DashboardLayout } from "@/components/layout";
import {
  AnalyticsTabButton,
  AuthorView,
  TeamLeadView,
} from "@/components/analytics";
import { useRepository } from "@/hooks/use-github";
import { ApiErrorState } from "@/components/ui";

type Tab = "author" | "team";

export default function AnalyticsPage() {
  const [tab, setTab] = useState<Tab>("author");
  const searchParams = useSearchParams();
  const owner = searchParams.get("owner") ?? undefined;
  const repo = searchParams.get("repo") ?? undefined;
  const scopedRepo = owner && repo ? { owner, repo } : undefined;

  const { error: scopedRepoError, refetch: refetchScopedRepo } = useRepository(
    owner ?? "",
    repo ?? "",
  );

  if (scopedRepo && scopedRepoError) {
    return (
      <DashboardLayout>
        <main className="flex-1 overflow-y-auto px-8 py-7 min-w-0">
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
      <main className="flex-1 overflow-y-auto px-8 py-7 min-w-0">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-9 h-9 rounded-lg bg-violet-100 flex items-center justify-center">
            <BarChart2 className="w-4 h-4 text-violet-600" />
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

        <div className="inline-flex items-center p-1 mb-6">
          <AnalyticsTabButton
            active={tab === "author"}
            onClick={() => setTab("author")}
            icon={<Waypoints className="w-3.5 h-3.5" />}
            label="Author view"
          />
          <AnalyticsTabButton
            active={tab === "team"}
            onClick={() => setTab("team")}
            icon={<Users className="w-3.5 h-3.5" />}
            label="Team lead view"
          />
        </div>

        {tab === "author" ? (
          <AuthorView scopedRepo={scopedRepo} />
        ) : (
          <TeamLeadView scopedRepo={scopedRepo} />
        )}
      </main>
    </DashboardLayout>
  );
}
