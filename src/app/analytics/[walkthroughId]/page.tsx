"use client";

import { use } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  BookOpen,
  ExternalLink,
  MessageSquare,
  Users,
} from "lucide-react";
import { DashboardLayout } from "@/components/layout";
import {
  useChapterAttention,
  useReviewProgress,
  useUnreadSummary,
} from "@/hooks/use-analytics";
import { useWalkthrough } from "@/hooks/use-walkthrough";
import {
  ChapterAttentionList,
  ReadingMatrix,
  UnreadChaptersCard,
} from "@/components/analytics";
import { WalkthroughStatusBadge } from "@/components/pr-detail";

export default function AnalyticsDetailPage({
  params,
}: {
  params: Promise<{ walkthroughId: string }>;
}) {
  const { walkthroughId } = use(params);

  const { data: wtData } = useWalkthrough(walkthroughId);
  const { data: rpData, isLoading: rpLoading } =
    useReviewProgress(walkthroughId);
  const { data: caData, isLoading: caLoading } =
    useChapterAttention(walkthroughId);
  const { data: usData } = useUnreadSummary(walkthroughId);

  const walkthrough = wtData?.data;
  const reviewProgress = rpData?.data;
  const chapterAttention = caData?.data;
  const unreadSummary = usData?.data;

  const reviewerCount = reviewProgress?.reviewers.length ?? 0;
  const chapterCount =
    walkthrough?.chapters.length ?? reviewProgress?.totalChapters ?? 0;
  const totalComments =
    chapterAttention?.chapters.reduce((s, c) => s + c.totalComments, 0) ?? 0;

  return (
    <DashboardLayout>
      <main className="flex-1 overflow-y-auto px-8 py-7 min-w-0">
        <Link
          href="/analytics"
          className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-800 mb-3"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Analytics
        </Link>

        <div className="flex items-start justify-between gap-4 mb-2 flex-wrap">
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-[22px] font-bold text-gray-900 truncate">
                {walkthrough?.title ?? "Walkthrough"}
              </h1>
              {walkthrough && (
                <>
                  <span className="text-[11px] text-gray-500 bg-gray-100 rounded px-2 py-0.5">
                    {walkthrough.repo}
                  </span>
                  <span className="text-[11px] text-gray-500 bg-gray-100 rounded px-2 py-0.5">
                    PR #{walkthrough.prNumber}
                  </span>
                  <WalkthroughStatusBadge status={walkthrough.status} />
                </>
              )}
            </div>
            {walkthrough?.description && (
              <p className="text-sm text-gray-500 mt-1">
                {walkthrough.description}
              </p>
            )}
          </div>

          {walkthrough && (
            <Link
              href={`/walkthroughs/${walkthrough.id}`}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-700 bg-white hover:bg-gray-50 border border-gray-200 rounded-md px-3 py-1.5 shrink-0"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              View walkthrough
            </Link>
          )}
        </div>

        <div className="flex items-center gap-4 text-xs text-gray-500 mb-6 flex-wrap">
          <span className="inline-flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5" />
            {reviewerCount} {reviewerCount === 1 ? "reviewer" : "reviewers"}
          </span>
          <span className="text-gray-300">·</span>
          <span className="inline-flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5" />
            {chapterCount} {chapterCount === 1 ? "chapter" : "chapters"}
          </span>
          <span className="text-gray-300">·</span>
          <span className="inline-flex items-center gap-1.5">
            <MessageSquare className="w-3.5 h-3.5" />
            {totalComments} {totalComments === 1 ? "comment" : "comments"}
          </span>
        </div>

        <div className="space-y-4">
          {unreadSummary && <UnreadChaptersCard data={unreadSummary} />}

          {rpLoading ? (
            <SkeletonBlock />
          ) : reviewProgress ? (
            <ReadingMatrix data={reviewProgress} />
          ) : null}

          {caLoading ? (
            <SkeletonBlock />
          ) : chapterAttention ? (
            <ChapterAttentionList data={chapterAttention} />
          ) : null}
        </div>
      </main>
    </DashboardLayout>
  );
}

function SkeletonBlock() {
  return (
    <div className="h-48 bg-white border border-gray-200 rounded-xl animate-pulse" />
  );
}
