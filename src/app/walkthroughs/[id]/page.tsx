'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

import { AlertTriangle, ArrowLeft, BarChart2, Pencil, Trash2, Waypoints } from 'lucide-react';

import { RiskAnalysisPanel } from '@/components/walkthrough-detail/risk/risk-analysis-panel';
import { ScanRisksButton } from '@/components/walkthrough-detail/risk/scan-risks-button';
import { useRiskScan } from '@/hooks/use-risk';

import { DashboardLayout } from '@/components/layout';
import { ApiErrorState, Skeleton, UserAvatar } from '@/components/ui';
import { Button } from '@/components/ui/button';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import {
  ChapterSection,
  CommentSection,
  FileTreePanel,
  FilesPanel,
  ReviewDecisionSection,
} from '@/components/walkthrough-detail';
import { ChapterExpandProvider } from '@/components/walkthrough-detail/chapter-expand-context';

import { useCurrentUser } from '@/hooks/use-auth';
import { useDeleteWalkthrough, useReadProgress, useSyncCheck, useWalkthrough } from '@/hooks/use-walkthrough';

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
  const { data: riskScan } = useRiskScan(params.id);
  const syncCheck = useSyncCheck(params.id);
  const deleteWalkthrough = useDeleteWalkthrough(params.id);
  const hasSyncedRef = useRef(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const walkthrough = data?.data;

  // Fire a sync-check once per page load for PUBLISHED walkthroughs.
  // The server's GITHUB_PR_FILES cache (10-min TTL) absorbs repeated calls.
  useEffect(() => {
    if (!walkthrough || hasSyncedRef.current) return;
    if (walkthrough.status === 'PUBLISHED') {
      hasSyncedRef.current = true;
      syncCheck.mutate();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [walkthrough?.id, walkthrough?.status]);

  // group completed risks by walkthroughFileId for per-file badges
  const risksByFileId = riskScan?.status === 'COMPLETED'
    ? riskScan.risks.reduce<Record<string, import('@/types/risk').RiskZone[]>>((acc, r) => {
        acc[r.walkthroughFileId] = [...(acc[r.walkthroughFileId] ?? []), r];
        return acc;
      }, {})
    : {};
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
            onClick={() =>
              walkthrough
                ? router.push(`/repos/${walkthrough.owner}/${walkthrough.repo}/pulls/${walkthrough.prNumber}`)
                : router.back()
            }
            className="shrink-0 gap-1.5 px-1 py-1 text-sm font-normal hover:bg-transparent"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>

          {walkthrough ? (
            <>
              <div className="flex min-w-0 flex-1 items-center gap-3">
                <Waypoints className="h-4 w-4 shrink-0 text-gray-400" />
                <span className="text-sm font-semibold text-gray-900">{walkthrough.title}</span>
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

                <ScanRisksButton walkthroughId={walkthrough.id} />

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
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-1.5 rounded-xl text-red-600 border-none hover:border-red-300 hover:bg-red-50 hover:text-red-700"
                      onClick={() => setShowDeleteDialog(true)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
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
                {/* Outdated banner */}
                {walkthrough.status === 'OUTDATED' && (
                  <div className="flex gap-3 rounded-xl border border-amber-200 bg-amber-50 px-5 py-4">
                    <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
                    <div className="min-w-0">
                      <p className="mb-1 text-sm font-semibold text-amber-800">
                        This walkthrough is out of date
                      </p>
                      {walkthrough.outdatedReason && (
                        <p className="whitespace-pre-line text-xs leading-relaxed text-amber-700">
                          {walkthrough.outdatedReason}
                        </p>
                      )}
                      {isOwner && (
                        <p className="mt-2 text-xs text-amber-600">
                          Edit the walkthrough to fix the file set, then re-publish.
                        </p>
                      )}
                    </div>
                  </div>
                )}

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
                  {/* Risk Analysis */}
                  {riskScan && (
                    <RiskAnalysisPanel
                      walkthroughId={walkthrough.id}
                      scan={riskScan}
                      chapters={walkthrough.chapters}
                    />
                  )}

                  {/* Chapters */}
                  {walkthrough.chapters.map((chapter, idx) => (
                    <ChapterSection
                      key={chapter.id}
                      chapter={chapter}
                      index={idx}
                      walkthroughId={walkthrough.id}
                      isOwner={isOwner}
                      isRead={progress?.readChapterIds?.includes(chapter.id) ?? false}
                      risksByFileId={risksByFileId}
                    />
                  ))}

                  {/* Files navigation panel */}
                  <FilesPanel walkthrough={walkthrough} />

                  {/* Repo folder-tree panel */}
                  <FileTreePanel walkthrough={walkthrough} />
                </ChapterExpandProvider>

                {/* General Discussion */}
                <CommentSection walkthroughId={walkthrough.id} />

                {/* Review Decision */}
                {walkthrough.status === 'PUBLISHED' && (
                  <ReviewDecisionSection walkthroughId={walkthrough.id} isOwner={isOwner} />
                )}
              </>
            ) : (
              <div className="py-20 text-center text-sm text-gray-400">Walkthrough not found.</div>
            )}
          </div>
        </main>
      </div>

      <ConfirmDialog
        open={showDeleteDialog}
        tone="danger"
        title="Delete walkthrough"
        description="This will permanently delete the walkthrough and all its comments. This action cannot be undone."
        confirmLabel="Delete"
        onCancel={() => setShowDeleteDialog(false)}
        onConfirm={() => {
          setShowDeleteDialog(false);
          deleteWalkthrough.mutate(undefined, {
            onSuccess: () => {
              if (walkthrough) {
                router.push(
                  `/repos/${walkthrough.owner}/${walkthrough.repo}/pulls/${walkthrough.prNumber}`
                );
              } else {
                router.back();
              }
            },
          });
        }}
      />
    </DashboardLayout>
  );
}
