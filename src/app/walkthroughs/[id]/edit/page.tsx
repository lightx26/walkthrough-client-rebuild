"use client";

import { useMemo, useEffect, useState, startTransition } from "react";
import { useParams, useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/layout";
import { Skeleton } from "@/components/ui";
import { usePullRequestFiles } from "@/hooks/use-github";
import { useWalkthrough, useUpdateWalkthrough } from "@/hooks/use-walkthrough";
import {
  WalkthroughEditor,
  type ChapterDraft,
  type WalkthroughFormData,
} from "@/components/create-walkthrough";
import type { PrFile, PrFileStatus } from "@/types/github";
import type { UpdateWalkthroughRequest, Walkthrough } from "@/types/walkthrough";

function normalizeStatus(fileStatus: string): PrFileStatus {
  const s = fileStatus.toLowerCase();
  if (s === "added") return "added";
  if (s === "removed" || s === "deleted") return "removed";
  if (s === "renamed") return "renamed";
  return "modified";
}

function walkthroughToChapters(
  walkthrough: Walkthrough,
  allFiles: PrFile[],
): ChapterDraft[] {
  return walkthrough.chapters.map((ch) => ({
    id: ch.id,
    title: ch.title,
    description: ch.description ?? "",
    files: ch.files.map((f) => {
      const match = allFiles.find((pf) => pf.filename === f.filename);
      if (match) return match;
      return {
        sha: f.fileSha,
        filename: f.filename,
        status: normalizeStatus(f.fileStatus),
        additions: 0,
        deletions: 0,
        changes: 0,
        patch: f.rawPatch,
      } satisfies PrFile;
    }),
  }));
}

function EditSkeleton() {
  return (
    <div className="flex flex-1 min-h-0 min-w-0">
      <div className="w-68 shrink-0 border-r border-gray-200 bg-white" />
      <div className="flex-1 flex flex-col min-h-0">
        <div className="flex items-center gap-3 px-5 py-3 border-b border-gray-200 bg-white shrink-0">
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-4 w-48 flex-1" />
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-8 w-20" />
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-5">
          <div className="max-w-2xl mx-auto space-y-5">
            <Skeleton className="h-28 w-full rounded-xl" />
            <Skeleton className="h-48 w-full rounded-xl" />
            <Skeleton className="h-48 w-full rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
}

function EditWalkthroughContent({ walkthroughId }: { walkthroughId: string }) {
  const router = useRouter();

  const { data: wtData, isLoading: wtLoading } = useWalkthrough(walkthroughId);
  const walkthrough = wtData?.data;

  const owner = walkthrough?.owner ?? "";
  const repo = walkthrough?.repo ?? "";
  const prNumber = walkthrough?.prNumber ?? 0;

  const { data: filesData, isLoading: filesLoading } = usePullRequestFiles({
    owner,
    repo,
    prNumber,
  });

  const allFiles = useMemo(() => filesData?.data?.items ?? [], [filesData?.data?.items]);

  const [initialized, setInitialized] = useState(false);
  const [initialChapters, setInitialChapters] = useState<ChapterDraft[]>();

  const updateWalkthrough = useUpdateWalkthrough(walkthroughId);

  // Compute initial chapters once walkthrough + files are ready
  useEffect(() => {
    if (initialized || !walkthrough || filesLoading) return;
    startTransition(() => {
      setInitialChapters(walkthroughToChapters(walkthrough, allFiles));
      setInitialized(true);
    });
  }, [walkthrough, allFiles, filesLoading, initialized]);

  const handleSave = (data: WalkthroughFormData, status: "DRAFT" | "PUBLISHED") => {
    const request: UpdateWalkthroughRequest = {
      title: data.title,
      description: data.description,
      status,
      chapters: data.chapters,
    };

    updateWalkthrough.mutate(request, {
      onSuccess: () => {
        router.push(`/walkthroughs/${walkthroughId}`);
      },
    });
  };

  if (wtLoading || (walkthrough && filesLoading && !initialized)) {
    return <EditSkeleton />;
  }

  if (!walkthrough) {
    return (
      <div className="flex-1 flex items-center justify-center text-sm text-gray-400">
        Walkthrough not found.
      </div>
    );
  }

  return (
    <WalkthroughEditor
      key={walkthroughId}
      headerTitle="Edit walkthrough"
      repo={repo}
      prNumber={prNumber}
      allFiles={allFiles}
      filesLoading={filesLoading && !initialized}
      initialTitle={walkthrough.title}
      initialDescription={walkthrough.description ?? ""}
      initialChapters={initialChapters}
      onSave={handleSave}
      isSaving={updateWalkthrough.isPending}
      canDeleteChapters
    />
  );
}

export default function EditWalkthroughPage() {
  const params = useParams<{ id: string }>();

  return (
    <DashboardLayout>
      <EditWalkthroughContent walkthroughId={params.id} />
    </DashboardLayout>
  );
}
