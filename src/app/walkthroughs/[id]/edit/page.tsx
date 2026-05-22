"use client";

import { useState, useMemo, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { ArrowLeft, BookOpen, Plus, Send } from "lucide-react";
import { DashboardLayout } from "@/components/layout";
import { Skeleton } from "@/components/ui";
import { Button } from "@/components/ui/button";
import { usePullRequestFiles } from "@/hooks/use-github";
import { useWalkthrough, useUpdateWalkthrough } from "@/hooks/use-walkthrough";
import {
  ChangedFilesPanel,
  ChapterCard,
  type ChapterDraft,
  DiffFileModal,
} from "@/components/create-walkthrough";
import type { PrFile, PrFileStatus } from "@/types/github";
import type { UpdateWalkthroughRequest, Walkthrough } from "@/types/walkthrough";
import { toast } from "sonner";

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

  const allFiles = filesData?.data?.items ?? [];

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [chapters, setChapters] = useState<ChapterDraft[]>([]);
  const [activeFileDiff, setActiveFileDiff] = useState<PrFile | null>(null);
  const [initialized, setInitialized] = useState(false);

  const updateWalkthrough = useUpdateWalkthrough(walkthroughId);

  // Initialize form once walkthrough is loaded (and preferably files too)
  useEffect(() => {
    if (initialized || !walkthrough) return;
    // Wait for files if they're still loading, so we can enrich the chapter files
    if (filesLoading) return;
    setTitle(walkthrough.title);
    setDescription(walkthrough.description ?? "");
    setChapters(walkthroughToChapters(walkthrough, allFiles));
    setInitialized(true);
  }, [walkthrough, allFiles, filesLoading, initialized]);

  const assignedFilenames = useMemo(() => {
    const set = new Set<string>();
    for (const ch of chapters) {
      for (const f of ch.files) set.add(f.filename);
    }
    return set;
  }, [chapters]);

  const totalAssigned = assignedFilenames.size;
  const totalFiles = allFiles.length;

  const handleChapterChange = (id: string, updated: ChapterDraft) => {
    setChapters((prev) => prev.map((ch) => (ch.id === id ? updated : ch)));
  };

  const handleDeleteChapter = (id: string) => {
    setChapters((prev) => prev.filter((ch) => ch.id !== id));
  };

  const handleAddChapter = () => {
    setChapters((prev) => [
      ...prev,
      { id: crypto.randomUUID(), title: "", description: "", files: [] },
    ]);
  };

  const handleSave = (status: "DRAFT" | "PUBLISHED") => {
    if (!title.trim()) {
      toast.error("Please enter a walkthrough title.");
      return;
    }

    const request: UpdateWalkthroughRequest = {
      title: title.trim(),
      description: description.trim() || undefined,
      status,
      chapters: chapters
        .filter((ch) => ch.title.trim() || ch.files.length > 0)
        .map((ch) => ({
          title: ch.title.trim() || "Chapter",
          description: ch.description.trim() || undefined,
          files: ch.files.map((f) => ({
            filename: f.filename,
            fileSha: f.sha,
            fileStatus: f.status,
            rawPatch: f.patch,
          })),
        })),
    };

    updateWalkthrough.mutate(request, {
      onSuccess: () => {
        router.push(`/walkthroughs/${walkthroughId}`);
      },
    });
  };

  const isSaving = updateWalkthrough.isPending;

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
    <DndProvider backend={HTML5Backend}>
      <div className="flex flex-1 min-h-0 min-w-0">
        {/* Left panel */}
        <ChangedFilesPanel
          files={allFiles}
          assignedFilenames={assignedFilenames}
          repo={repo}
          prNumber={prNumber}
          isLoading={filesLoading && !initialized}
        />

        {/* Right panel */}
        <div className="flex-1 flex flex-col min-h-0 min-w-0">
          {/* Sub-header */}
          <div className="flex items-center gap-3 px-5 py-3 border-b border-gray-200 bg-white shrink-0">
            <Button
              variant="muted"
              size="none"
              onClick={() => router.back()}
              className="gap-1.5 px-1 py-1 text-sm font-normal hover:bg-transparent shrink-0"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>

            <div className="flex items-center gap-2 flex-1 min-w-0">
              <BookOpen className="w-4 h-4 text-gray-400 shrink-0" />
              <span className="text-sm font-semibold text-gray-900">
                Edit walkthrough
              </span>
              <span className="text-sm text-gray-400 truncate">
                {repo} · #{prNumber}
              </span>
            </div>

            <span className="text-xs text-gray-400 shrink-0">
              {chapters.length}{" "}
              {chapters.length === 1 ? "chapter" : "chapters"} · {totalAssigned}{" "}
              of {totalFiles} files assigned
            </span>

            <Button
              variant="outline"
              size="sm"
              onClick={() => handleSave("DRAFT")}
              disabled={isSaving}
              className="shrink-0"
            >
              Save draft
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => handleSave("PUBLISHED")}
              disabled={isSaving}
              className="gap-1.5 shrink-0"
            >
              <Send className="w-3.5 h-3.5" />
              Publish
            </Button>
          </div>

          {/* Scrollable form */}
          <div className="flex-1 overflow-y-auto px-6 py-5">
            <div className="max-w-2xl mx-auto space-y-5">
              {/* Title & description card */}
              <div className="bg-white rounded-xl border border-gray-200 px-5 py-4 space-y-3">
                <div>
                  <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-2">
                    Walkthrough title
                  </p>
                  <input
                    type="text"
                    placeholder="e.g. Snapshot versioning — full walkthrough"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full text-base text-gray-900 placeholder:text-gray-300 outline-none bg-transparent"
                  />
                </div>
                <hr className="border-gray-100" />
                <div>
                  <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-2">
                    Description
                  </p>
                  <textarea
                    placeholder="Give reviewers a high-level summary of what this walkthrough covers..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                    className="w-full text-sm text-gray-700 placeholder:text-gray-300 outline-none bg-transparent resize-none leading-relaxed"
                  />
                </div>
              </div>

              {/* Chapters */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <h2 className="text-sm font-semibold text-gray-900">
                      Chapters
                    </h2>
                    <span className="text-xs bg-violet-100 text-violet-700 font-semibold rounded-full px-2 py-0.5">
                      {chapters.length}
                    </span>
                  </div>
                  <span className="text-xs text-gray-400">
                    Each chapter covers a set of changes
                  </span>
                </div>

                <div className="space-y-3">
                  {chapters.map((chapter, i) => (
                    <ChapterCard
                      key={chapter.id}
                      chapter={chapter}
                      index={i}
                      onChange={(updated) =>
                        handleChapterChange(chapter.id, updated)
                      }
                      onViewFileDiff={setActiveFileDiff}
                      onDelete={
                        chapters.length > 1
                          ? () => handleDeleteChapter(chapter.id)
                          : undefined
                      }
                    />
                  ))}
                </div>

                <Button
                  variant="dashed"
                  size="none"
                  onClick={handleAddChapter}
                  className="mt-3 w-full gap-2 px-4 py-3 rounded-xl text-sm"
                >
                  <Plus className="w-4 h-4" />
                  Add chapter
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {activeFileDiff && (
        <DiffFileModal
          file={activeFileDiff}
          onClose={() => setActiveFileDiff(null)}
        />
      )}
    </DndProvider>
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
