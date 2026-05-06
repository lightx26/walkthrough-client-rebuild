"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, BookOpen, Pencil } from "lucide-react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { UserAvatar } from "@/components/ui/user-avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { useCurrentUser } from "@/hooks/use-auth";
import { useWalkthrough } from "@/hooks/use-walkthrough";
import { formatRelativeTime } from "@/utils/date-diff";
import { ChapterSection } from "@/components/walkthrough-detail/chapter-section";
import { CommentSection } from "@/components/walkthrough-detail/comment-section";
import { FilesPanel } from "@/components/walkthrough-detail/files-panel";

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

  const { data, isLoading } = useWalkthrough(params.id);

  const walkthrough = data?.data;
  const isOwner = !!user && !!walkthrough && user.id === walkthrough.userId;

  return (
    <DashboardLayout>
      <div className="flex-1 flex flex-col min-h-0">
        {/* Sub-header */}
        <div className="flex items-center gap-4 px-6 py-3.5 border-b border-gray-200 bg-white shrink-0">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-700 transition-colors shrink-0"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>

          {walkthrough ? (
            <>
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <BookOpen className="w-4 h-4 text-gray-400 shrink-0" />
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
                    {walkthrough.creatorDisplayName || walkthrough.creatorUsername}
                  </span>
                  <span className="text-xs text-gray-400">
                    {formatRelativeTime(walkthrough.updatedAt)}
                  </span>
                </div>

                {isOwner && (
                  <Link
                    href={`/walkthroughs/${walkthrough.id}/edit`}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-violet-600 text-white text-sm font-medium hover:bg-violet-700 transition-colors"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                    Edit
                  </Link>
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

                {/* Chapters */}
                {walkthrough.chapters.map((chapter, idx) => (
                  <ChapterSection key={chapter.id} chapter={chapter} index={idx} walkthroughId={walkthrough.id} />
                ))}

                {/* General Discussion */}
                <CommentSection walkthroughId={walkthrough.id} />

                {/* Files navigation panel */}
                <FilesPanel walkthrough={walkthrough} />
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
