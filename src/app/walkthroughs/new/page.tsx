"use client";

import { Suspense, useState, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { ArrowLeft, BookOpen, Plus, Send } from "lucide-react";
import { DashboardLayout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { usePullRequest, usePullRequestFiles } from "@/hooks/use-github";
import { useCreateWalkthrough } from "@/hooks/use-walkthrough";
import {
  ChangedFilesPanel,
  ChapterCard,
  type ChapterDraft,
  DiffFileModal,
} from "@/components/create-walkthrough";
import type { PrFile } from "@/types/github";
import type { CreateWalkthroughRequest } from "@/types/walkthrough";
import { toast } from "sonner";

function CreateWalkthroughContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const owner = searchParams.get("owner") ?? "";
  const repo = searchParams.get("repo") ?? "";
  const prNumber = Number(searchParams.get("prNumber"));

  const { data: prData } = usePullRequest({ owner, repo, prNumber });
  const { data: filesData, isLoading: filesLoading } = usePullRequestFiles({
    owner,
    repo,
    prNumber,
  });

  const pr = prData?.data;
  const allFiles = filesData?.data?.items ?? [];

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [chapters, setChapters] = useState<ChapterDraft[]>([
    { id: crypto.randomUUID(), title: "", description: "", files: [] },
  ]);
  const [activeFileDiff, setActiveFileDiff] = useState<PrFile | null>(null);

  const createWalkthrough = useCreateWalkthrough();

  const assignedFilenames = useMemo(() => {
    const set = new Set<string>();
    for (const ch of chapters) {
      for (const f of ch.files) set.add(f.filename);
    }
    return set;
  }, [chapters]);

  const totalAssigned = assignedFilenames.size;
  const totalFiles = allFiles.length;
  const allFilesAssigned = totalFiles > 0 && totalAssigned === totalFiles;

  const handleChapterChange = (id: string, updated: ChapterDraft) => {
    setChapters((prev) => prev.map((ch) => (ch.id === id ? updated : ch)));
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

    const request: CreateWalkthroughRequest = {
      owner,
      repo,
      prNumber,
      title: title.trim(),
      description: description.trim() || undefined,
      status,
      chapters: chapters
        .filter((ch) => ch.title.trim() || ch.files.length > 0)
        .map((ch) => ({
          title: ch.title.trim() || `Chapter`,
          description: ch.description.trim() || undefined,
          files: ch.files.map((f) => ({
            filename: f.filename,
            fileSha: f.sha,
            fileStatus: f.status,
            rawPatch: f.patch,
          })),
        })),
    };

    createWalkthrough.mutate(request, {
      onSuccess: (data) => {
        router.push(`/walkthroughs/${data.data.id}`);
      },
    });
  };

  const isSaving = createWalkthrough.isPending;

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex flex-1 min-h-0 min-w-0">
        {/* Left panel */}
        <ChangedFilesPanel
          files={allFiles}
          assignedFilenames={assignedFilenames}
          repo={repo}
          prNumber={prNumber}
          isLoading={filesLoading}
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
                New walkthrough
              </span>
              {pr && (
                <span className="text-sm text-gray-400 truncate">
                  {repo} · #{pr.number}
                </span>
              )}
            </div>

            <span className="text-xs text-gray-400 shrink-0">
              {chapters.length} {chapters.length === 1 ? "chapter" : "chapters"}{" "}
              · {totalAssigned} of {totalFiles} files assigned
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
              disabled={isSaving || !allFilesAssigned}
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
                    />
                  ))}
                </div>

                {/* Add chapter */}
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

      {/* Diff popup */}
      {activeFileDiff && (
        <DiffFileModal
          file={activeFileDiff}
          onClose={() => setActiveFileDiff(null)}
        />
      )}
    </DndProvider>
  );
}

export default function CreateWalkthroughPage() {
  return (
    <DashboardLayout>
      <Suspense
        fallback={
          <div className="flex-1 flex items-center justify-center">
            <div className="w-7 h-7 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
          </div>
        }
      >
        <CreateWalkthroughContent />
      </Suspense>
    </DashboardLayout>
  );
}
