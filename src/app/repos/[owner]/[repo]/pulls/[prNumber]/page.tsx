"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  ChevronRight,
  FileText,
  GitCommitHorizontal,
  GitMerge,
  GitPullRequest,
  GitPullRequestClosed,
  MessageSquare,
  Plus,
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Skeleton } from "@/components/ui/skeleton";
import { UserAvatar } from "@/components/ui/user-avatar";
import { githubService } from "@/services/github.service";
import { walkthroughService } from "@/services/walkthrough.service";
import { formatRelativeTime } from "@/utils/date-diff";
import { cn } from "@/lib/utils";
import type { PullRequestState } from "@/types/github";
import type { WalkthroughStatus, WalkthroughSummary } from "@/types/walkthrough";

type TabKey = "all" | "published" | "draft";

function PrStateBadge({ state }: { state: PullRequestState }) {
  if (state === "open")
    return (
      <span className="inline-flex items-center gap-1.5 text-sm font-medium px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
        <GitPullRequest className="w-3.5 h-3.5" strokeWidth={2} />
        Open
      </span>
    );
  if (state === "merged")
    return (
      <span className="inline-flex items-center gap-1.5 text-sm font-medium px-3 py-1 rounded-full bg-violet-50 text-violet-700 border border-violet-200">
        <GitMerge className="w-3.5 h-3.5" strokeWidth={2} />
        Merged
      </span>
    );
  return (
    <span className="inline-flex items-center gap-1.5 text-sm font-medium px-3 py-1 rounded-full bg-red-50 text-red-600 border border-red-200">
      <GitPullRequestClosed className="w-3.5 h-3.5" strokeWidth={2} />
      Closed
    </span>
  );
}

function WalkthroughStatusBadge({ status }: { status: WalkthroughStatus }) {
  if (status === "PUBLISHED")
    return (
      <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
        Published
      </span>
    );
  if (status === "DRAFT")
    return (
      <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
        Draft
      </span>
    );
  if (status === "OUTDATED")
    return (
      <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-orange-50 text-orange-700 border border-orange-200">
        Outdated
      </span>
    );
  return (
    <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 border border-gray-200">
      Deprecated
    </span>
  );
}

function walkthroughAccentColor(status: WalkthroughStatus) {
  if (status === "PUBLISHED") return "#34d399"; // emerald-400
  if (status === "DRAFT") return "#fbbf24"; // amber-400
  if (status === "OUTDATED") return "#fb923c"; // orange-400
  return "#d1d5db"; // gray-300
}

function walkthroughIconColor(status: WalkthroughStatus) {
  if (status === "PUBLISHED") return "text-emerald-600";
  if (status === "DRAFT") return "text-amber-600";
  if (status === "OUTDATED") return "text-orange-500";
  return "text-gray-400";
}

function WalkthroughCard({ wt, owner, repo }: { wt: WalkthroughSummary; owner: string; repo: string }) {
  return (
    <div
      className="flex items-center gap-4 p-5 rounded-xl border border-gray-200 bg-white"
      style={{ borderLeftColor: walkthroughAccentColor(wt.status), borderLeftWidth: 4 }}
    >
      <BookOpen className={cn("w-5 h-5 shrink-0", walkthroughIconColor(wt.status))} strokeWidth={1.75} />

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <WalkthroughStatusBadge status={wt.status} />
        </div>
        <p className="text-sm font-semibold text-gray-900 mb-1">{wt.title}</p>
        {wt.description && (
          <p className="text-xs text-gray-500 truncate mb-2">{wt.description}</p>
        )}
        <div className="flex items-center gap-3 text-xs text-gray-400">
          <span className="flex items-center gap-1">
            <BookOpen className="w-3 h-3" />
            {wt.chapterCount} {wt.chapterCount === 1 ? "chapter" : "chapters"}
          </span>
          {wt.commentCount > 0 && (
            <span className="flex items-center gap-1">
              <MessageSquare className="w-3 h-3" />
              {wt.commentCount} {wt.commentCount === 1 ? "comment" : "comments"}
            </span>
          )}
          <span>{formatRelativeTime(wt.updatedAt)}</span>
        </div>
      </div>

      <Link
        href={`/walkthroughs/${wt.id}`}
        className="inline-flex items-center gap-1 text-sm font-semibold text-white bg-violet-600 hover:bg-violet-700 transition-colors px-4 py-2 rounded-lg shrink-0"
      >
        Open
        <ChevronRight className="w-4 h-4" />
      </Link>
    </div>
  );
}

function PrHeaderSkeleton() {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
      <div className="flex items-center gap-3">
        <Skeleton className="h-7 w-20 rounded-full" />
        <Skeleton className="h-5 w-10" />
      </div>
      <Skeleton className="h-7 w-3/4" />
      <div className="flex items-center gap-2">
        <Skeleton className="h-6 w-6 rounded-full" />
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-5 w-40 rounded" />
      </div>
      <div className="flex items-center gap-4">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-4 w-12" />
        <Skeleton className="h-4 w-12" />
      </div>
    </div>
  );
}

function WalkthroughCardSkeleton() {
  return (
    <div className="flex items-center gap-4 p-5 rounded-xl border border-gray-200 bg-white">
      <Skeleton className="w-5 h-5 rounded shrink-0" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-16 rounded-full" />
        <Skeleton className="h-4 w-56" />
        <Skeleton className="h-3 w-40" />
        <Skeleton className="h-3 w-32" />
      </div>
      <Skeleton className="h-9 w-20 rounded-lg shrink-0" />
    </div>
  );
}

export default function PrDetailPage() {
  const params = useParams<{ owner: string; repo: string; prNumber: string }>();
  const owner = params.owner;
  const repo = params.repo;
  const prNumber = Number(params.prNumber);

  const [activeTab, setActiveTab] = useState<TabKey>("all");

  const { data: prData, isLoading: prLoading } = useQuery({
    queryKey: ["pr", owner, repo, prNumber],
    queryFn: () => githubService.getPullRequest(owner, repo, prNumber),
    enabled: !!owner && !!repo && !!prNumber,
  });

  const { data: walkthroughsData, isLoading: walkthroughsLoading } = useQuery({
    queryKey: ["walkthroughs", owner, repo, prNumber],
    queryFn: () => walkthroughService.list(owner, repo, prNumber),
    enabled: !!owner && !!repo && !!prNumber,
  });

  const pr = prData?.data;
  const walkthroughs = walkthroughsData?.data?.items ?? [];

  const counts = {
    all: walkthroughs.length,
    published: walkthroughs.filter((w) => w.status === "PUBLISHED").length,
    draft: walkthroughs.filter((w) => w.status === "DRAFT").length,
  };

  const tabs: { label: string; key: TabKey }[] = [
    { label: "All", key: "all" },
    { label: "Published", key: "published" },
    { label: "Draft", key: "draft" },
  ];

  const filtered = walkthroughs.filter((w) => {
    if (activeTab === "all") return true;
    if (activeTab === "published") return w.status === "PUBLISHED";
    if (activeTab === "draft") return w.status === "DRAFT";
    return true;
  });

  return (
    <DashboardLayout>
      <main className="flex-1 overflow-y-auto px-8 py-7 min-w-0">
        <div className="mb-6">
          <div className="flex items-center gap-1.5 text-sm text-gray-400 mb-5">
            <Link href="/repos" className="hover:text-gray-600 transition-colors">
              Repositories
            </Link>
            <span>/</span>
            <Link
              href={`/repos/${owner}/${repo}`}
              className="hover:text-gray-600 transition-colors"
            >
              {repo}
            </Link>
            <span>/</span>
            <span className="text-gray-700 font-medium">#{prNumber}</span>
          </div>

          {prLoading ? (
            <PrHeaderSkeleton />
          ) : pr ? (
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <div className="flex items-center gap-2.5 mb-3">
                <PrStateBadge state={pr.state} />
                <span className="text-sm text-gray-400">#{pr.number}</span>
              </div>

              <h1 className="text-xl font-bold text-gray-900 mb-3">{pr.title}</h1>

              <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                <UserAvatar
                  src={pr.author.avatarUrl}
                  username={pr.author.login}
                  size="sm"
                />
                <span className="font-medium text-gray-700">{pr.author.login}</span>
                <span className="text-gray-400">·</span>
                <span className="text-gray-400">opened {formatRelativeTime(pr.createdAt)}</span>
                <span className="text-gray-400">·</span>
                <code className="text-[11px] bg-gray-100 px-1.5 py-0.5 rounded text-gray-600 font-mono">
                  {pr.head.ref}
                </code>
                <ArrowRight className="w-3.5 h-3.5 text-gray-400" />
                <code className="text-[11px] bg-gray-100 px-1.5 py-0.5 rounded text-gray-600 font-mono">
                  {pr.base.ref}
                </code>
              </div>

              <div className="flex items-center gap-5 text-sm text-gray-500">
                <span className="flex items-center gap-1.5">
                  <GitCommitHorizontal className="w-4 h-4 text-gray-400" />
                  {pr.commits} {pr.commits === 1 ? "commit" : "commits"}
                </span>
                <span className="flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-gray-400" />
                  {pr.changedFiles} {pr.changedFiles === 1 ? "file changed" : "files changed"}
                </span>
                <span className="font-medium text-emerald-600">+{pr.additions}</span>
                <span className="font-medium text-red-500">-{pr.deletions}</span>
              </div>
            </div>
          ) : null}
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-[0_1px_3px_rgba(0,0,0,.04)]">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <h2 className="text-sm font-semibold text-gray-900">
              Walkthroughs{" "}
              <span className="ml-1 text-gray-400 font-normal">{walkthroughs.length}</span>
            </h2>
            <Link
              href={`/walkthroughs/new?owner=${owner}&repo=${repo}&prNumber=${prNumber}`}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-white bg-violet-600 hover:bg-violet-700 transition-colors px-4 py-2 rounded-lg"
            >
              <Plus className="w-4 h-4" />
              Create walkthrough
            </Link>
          </div>

          <div className="flex items-center gap-0.5 px-5 border-b border-gray-100">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-3.5 text-sm font-medium border-b-2 transition-colors",
                  activeTab === tab.key
                    ? "border-violet-600 text-violet-700"
                    : "border-transparent text-gray-500 hover:text-gray-700",
                )}
              >
                {tab.label}
                <span
                  className={cn(
                    "text-xs px-1.5 py-0.5 rounded-full font-medium",
                    activeTab === tab.key
                      ? "bg-violet-100 text-violet-700"
                      : "bg-gray-100 text-gray-500",
                  )}
                >
                  {counts[tab.key]}
                </span>
              </button>
            ))}
          </div>

          <div className="p-5 space-y-3">
            {walkthroughsLoading ? (
              <>
                <WalkthroughCardSkeleton />
                <WalkthroughCardSkeleton />
              </>
            ) : filtered.length === 0 ? (
              <div className="py-10 text-center text-sm text-gray-400">
                No walkthroughs yet.
              </div>
            ) : (
              filtered.map((wt) => (
                <WalkthroughCard key={wt.id} wt={wt} owner={owner} repo={repo} />
              ))
            )}
          </div>
        </div>
      </main>
    </DashboardLayout>
  );
}
