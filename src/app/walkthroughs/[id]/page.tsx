'use client';

import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';

import { ArrowLeft, BarChart2, Pencil, Waypoints } from 'lucide-react';

import { DashboardLayout } from '@/components/layout';
import { ApiErrorState, Skeleton, UserAvatar } from '@/components/ui';
import { Button } from '@/components/ui/button';
import {
  ChapterSection,
  CommentSection,
  FileTreePanel,
  FilesPanel,
} from '@/components/walkthrough-detail';
import { ChapterExpandProvider } from '@/components/walkthrough-detail/chapter-expand-context';

import { useCurrentUser } from '@/hooks/use-auth';
import { useReadProgress, useWalkthrough } from '@/hooks/use-walkthrough';

import { formatRelativeTime } from '@/utils/date-diff';

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
        <main className="min-w-0 flex-1 overflow-y-auto px-8 py-7">
          <ApiErrorState error={error} resource="walkthrough" onRetry={() => refetch()} />
        </main>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="flex min-h-0 flex-1 flex-col">
        {/* Sub-header */}
        <div className="flex shrink-0 items-center gap-4 border-b border-gray-200 bg-white px-6 py-3.5">
          <Button
            variant="muted"
            size="none"
            onClick={() => router.back()}
            className="shrink-0 gap-1.5 px-1 py-1 text-sm font-normal hover:bg-transparent"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>

          {walkthrough ? (
            <>
              <div className="flex min-w-0 flex-1 items-center gap-2">
                <Waypoints className="h-4 w-4 shrink-0 text-gray-400" />
                <h1 className="truncate text-sm font-semibold text-gray-900">
                  {walkthrough.title}
                </h1>
              </div>

              <div className="flex shrink-0 items-center gap-3">
                <div className="flex items-center gap-2">
                  <UserAvatar
                    src={walkthrough.creatorAvatarUrl}
                    displayName={walkthrough.creatorDisplayName}
                    username={walkthrough.creatorUsername}
                    size="sm"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    {walkthrough.creatorDisplayName || walkthrough.creatorUsername}
                  </span>
                  <span className="text-xs text-gray-400">
                    {formatRelativeTime(walkthrough.updatedAt)}
                  </span>
                </div>

                {isOwner && (
                  <>
                    {walkthrough.status !== 'DRAFT' && (
                      <Button asChild variant="outline" size="sm" className="gap-1.5 rounded-xl">
                        <Link href={`/analytics/${walkthrough.id}`}>
                          <BarChart2 className="h-3.5 w-3.5" />
                          Analytics
                        </Link>
                      </Button>
                    )}
                    <Button asChild variant="primary" size="sm" className="gap-1.5 rounded-xl">
                      <Link href={`/walkthroughs/${walkthrough.id}/edit`}>
                        <Pencil className="h-3.5 w-3.5" />
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
        <main className="min-w-0 flex-1 overflow-y-auto px-8 py-6">
          <div className="mx-auto max-w-4xl space-y-4">
            {isLoading ? (
              <DetailSkeleton />
            ) : walkthrough ? (
              <>
                {/* Description */}
                {walkthrough.description && (
                  <div className="rounded-xl border border-gray-200 bg-white px-6 py-4">
                    <p className="text-sm leading-relaxed text-gray-600">
                      {walkthrough.description}
                    </p>
                  </div>
                )}

                {/* Reading Progress */}
                {progress && progress.totalChapters > 0 && !isOwner && (
                  <div className="rounded-xl border border-gray-200 bg-white px-6 py-4">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">Review Progress</span>
                      <span className="text-xs text-gray-500">
                        {progress.readChapters}/{progress.totalChapters} chapters
                      </span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                      <div
                        className="h-full rounded-full bg-violet-500 transition-all"
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
                      isRead={progress?.readChapterIds?.includes(chapter.id) ?? false}
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
              <div className="py-20 text-center text-sm text-gray-400">Walkthrough not found.</div>
            )}
          </div>
        </main>
      </div>
    </DashboardLayout>
  );
}
