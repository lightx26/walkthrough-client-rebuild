"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, BarChart2, Pencil, Waypoints } from "lucide-react";
import { DashboardLayout } from "@/components/layout";
import { ApiErrorState, UserAvatar, Skeleton } from "@/components/ui";
import { Button } from "@/components/ui/button";
import { useCurrentUser } from "@/hooks/use-auth";
import { useWalkthrough, useReadProgress } from "@/hooks/use-walkthrough";
import { formatRelativeTime } from "@/utils/date-diff";
import {
  ChapterSection,
  CommentSection,
  FilesPanel,
  FileTreePanel,
} from "@/components/walkthrough-detail";
import { ChapterExpandProvider } from "@/components/walkthrough-detail/chapter-expand-context";

function DetailSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-20 w-full rounded-xl" />
      <Skeleton className="h-40 w-full rounded-xl" />
      <Skeleton className="h-40 w-full rounded-xl" />
      <Skeleton className="h-32 w-full rounded-xl" />
    </div>
  );
}

export default function WalkthroughDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const user = useCurrentUser();

  const { data, isLoading, error, refetch } = useWalkthrough(params.id);
  const { data: progressData } = useReadProgress(params.id);

  const walkthrough = data?.data;
  const progress = progressData?.data;
  const isOwner = !!user && !!walkthrough && user.id === walkthrough.userId;

  if (error) {
    return (
      <DashboardLayout>
        <main className="flex-1 overflow-y-auto px-8 py-7 min-w-0">
          <ApiErrorState
            error={error}
            resource="walkthrough"
            onRetry={() => refetch()}
          />
        </main>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="flex-1 flex flex-col min-h-0">
        {/* Sub-header */}
        <div className="flex items-center gap-4 px-6 py-3.5 border-b border-gray-200 bg-white shrink-0">
          <Button
            variant="muted"
            size="none"
            onClick={() => router.back()}
            className="gap-1.5 px-1 py-1 text-sm font-normal hover:bg-transparent shrink-0"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>

          {walkthrough ? (
            <>
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <Waypoints className="w-4 h-4 text-gray-400 shrink-0" />
                <h1 className="text-sm font-semibold text-gray-900 truncate">
                  {walkthrough.title}
                </h1>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <div className="flex items-center gap-2">
                  <UserAvatar
                    src={walkthrough.creatorAvatarUrl}
                    displayName={walkthrough.creatorDisplayName}
                    username={walkthrough.creatorUsername}
                    size="sm"
                  />
                  <span className="text-sm text-gray-700 font-medium">
                    {walkthrough.creatorDisplayName ||
                      walkthrough.creatorUsername}
                  </span>
                  <span className="text-xs text-gray-400">
                    {formatRelativeTime(walkthrough.updatedAt)}
                  </span>
                </div>

                {isOwner && (
                  <>
                    {walkthrough.status !== "DRAFT" && (
                      <Button
                        asChild
                        variant="outline"
                        size="sm"
                        className="gap-1.5 rounded-xl"
                      >
                        <Link href={`/analytics/${walkthrough.id}`}>
                          <BarChart2 className="w-3.5 h-3.5" />
                          Analytics
                        </Link>
                      </Button>
                    )}
                    <Button
                      asChild
                      variant="primary"
                      size="sm"
                      className="gap-1.5 rounded-xl"
                    >
                      <Link href={`/walkthroughs/${walkthrough.id}/edit`}>
                        <Pencil className="w-3.5 h-3.5" />
                        Edit
                      </Link>
                    </Button>
                  </>
                )}
              </div>
            </>
          ) : isLoading ? (
            <>
              <Skeleton className="h-4 w-64 flex-1" />
              <Skeleton className="h-8 w-32 shrink-0" />
            </>
          ) : null}
        </div>

        {/* Scrollable content */}
        <main className="flex-1 overflow-y-auto py-6 px-8 min-w-0">
          <div className="max-w-4xl mx-auto space-y-4">
            {isLoading ? (
              <DetailSkeleton />
            ) : walkthrough ? (
              <>
                {/* Description */}
                {walkthrough.description && (
                  <div className="bg-white rounded-xl border border-gray-200 px-6 py-4">
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {walkthrough.description}
                    </p>
                  </div>
                )}

                {/* Reading Progress */}
                {progress && progress.totalChapters > 0 && !isOwner && (
                  <div className="bg-white rounded-xl border border-gray-200 px-6 py-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">
                        Review Progress
                      </span>
                      <span className="text-xs text-gray-500">
                        {progress.readChapters}/{progress.totalChapters}{" "}
                        chapters
                      </span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-violet-500 rounded-full transition-all"
                        style={{
                          width: `${Math.round((progress.readChapters / progress.totalChapters) * 100)}%`,
                        }}
                      />
                    </div>
                  </div>
                )}

                <ChapterExpandProvider>
                  {/* Chapters */}
                  {walkthrough.chapters.map((chapter, idx) => (
                    <ChapterSection
                      key={chapter.id}
                      chapter={chapter}
                      index={idx}
                      walkthroughId={walkthrough.id}
                      isOwner={isOwner}
                      isRead={
                        progress?.readChapterIds?.includes(chapter.id) ?? false
                      }
                    />
                  ))}

                  {/* Files navigation panel */}
                  <FilesPanel walkthrough={walkthrough} />

                  {/* Repo folder-tree panel */}
                  <FileTreePanel walkthrough={walkthrough} />
                </ChapterExpandProvider>

                {/* General Discussion */}
                <CommentSection walkthroughId={walkthrough.id} />
              </>
            ) : (
              <div className="text-center py-20 text-sm text-gray-400">
                Walkthrough not found.
              </div>
            )}
          </div>
        </main>
      </div>
    </DashboardLayout>
  );
}
