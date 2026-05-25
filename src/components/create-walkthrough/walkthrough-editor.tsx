"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import {ArrowLeft, BookOpen, LayoutTemplate, Plus, Save, Send} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { ApplyTemplateDialog } from "./apply-template-dialog";
import { ChangedFilesPanel } from "./changed-files-panel";
import { ChapterCard, type ChapterDraft } from "./chapter-card";
import { DiffFileModal } from "./diff-file-modal";
import type { PrFile } from "@/types/github";
import type { ChapterRequest } from "@/types/walkthrough";
import type { Template } from "@/types/template";
import { toast } from "sonner";

export interface WalkthroughFormData {
  title: string;
  description?: string;
  chapters: ChapterRequest[];
}

export interface WalkthroughEditorProps {
  headerTitle: string;
  repo: string;
  prNumber: number;
  allFiles: PrFile[];
  filesLoading: boolean;
  initialTitle?: string;
  initialDescription?: string;
  initialChapters?: ChapterDraft[];
  onSave: (data: WalkthroughFormData, status: "DRAFT" | "PUBLISHED") => void;
  isSaving: boolean;
  requireAllFilesAssigned?: boolean;
  canDeleteChapters?: boolean;
}

function chaptersToRequest(chapters: ChapterDraft[]): ChapterRequest[] {
  return chapters
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
    }));
}

export function WalkthroughEditor({
  headerTitle,
  repo,
  prNumber,
  allFiles,
  filesLoading,
  initialTitle = "",
  initialDescription = "",
  initialChapters,
  onSave,
  isSaving,
  requireAllFilesAssigned = false,
  canDeleteChapters = false,
}: WalkthroughEditorProps) {
  const router = useRouter();

  const [title, setTitle] = useState(initialTitle);
  const [description, setDescription] = useState(initialDescription);
  const [chapters, setChapters] = useState<ChapterDraft[]>(
    initialChapters ?? [
      { id: crypto.randomUUID(), title: "", description: "", files: [] },
    ],
  );
  const [activeFileDiff, setActiveFileDiff] = useState<PrFile | null>(null);
  const [showApplyTemplate, setShowApplyTemplate] = useState(false);
  const [pendingTemplate, setPendingTemplate] = useState<Template | null>(null);

  const assignedFilenames = useMemo(() => {
    const set = new Set<string>();
    for (const ch of chapters) {
      for (const f of ch.files) set.add(f.filename);
    }
    return set;
  }, [chapters]);

  const allFilesAssigned =
    allFiles.length > 0 && assignedFilenames.size === allFiles.length;

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

  const applyTemplate = (template: Template) => {
    const sorted = [...(template.chapters ?? [])].sort(
      (a, b) => a.sortOrder - b.sortOrder,
    );
    setChapters(
      sorted.length > 0
        ? sorted.map((ch) => ({
            id: crypto.randomUUID(),
            title: ch.title,
            description: ch.description ?? "",
            files: [],
          }))
        : [{ id: crypto.randomUUID(), title: "", description: "", files: [] }],
    );
    setShowApplyTemplate(false);
    setPendingTemplate(null);
  };

  const handleApplyTemplate = (template: Template) => {
    if (assignedFilenames.size > 0) {
      setPendingTemplate(template);
      return;
    }
    applyTemplate(template);
  };

  const handleSave = (status: "DRAFT" | "PUBLISHED") => {
    if (!title.trim()) {
      toast.error("Please enter a walkthrough title.");
      return;
    }

    onSave(
      {
        title: title.trim(),
        description: description.trim() || undefined,
        chapters: chaptersToRequest(chapters),
      },
      status,
    );
  };

  const publishDisabled =
    isSaving || (requireAllFilesAssigned && !allFilesAssigned);

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
              <span className="text-sm font-semibold text-gray-900">
                {headerTitle}
              </span>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-2 shrink-0">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowApplyTemplate(true)}
                className="gap-1.5"
              >
                <LayoutTemplate className="w-3.5 h-3.5" />
                Apply template
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleSave("DRAFT")}
                disabled={isSaving}
                className="gap-1.5"
              >
                <Save className="w-3.5 h-3.5" />
                Save draft
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => handleSave("PUBLISHED")}
                disabled={publishDisabled}
                className="gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                Publish
              </Button>
            </div>
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
                        canDeleteChapters && chapters.length > 1
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

      <ApplyTemplateDialog
        open={showApplyTemplate}
        onClose={() => setShowApplyTemplate(false)}
        onApply={handleApplyTemplate}
      />

      <ConfirmDialog
        open={!!pendingTemplate}
        title="Replace current chapters?"
        description={
          <>
            You have <strong>{assignedFilenames.size}</strong> file
            {assignedFilenames.size === 1 ? "" : "s"} assigned to chapters.
            Applying{pendingTemplate ? ` "${pendingTemplate.name}"` : ""} will
            replace all chapters and unassign these files.
          </>
        }
        tone="warning"
        confirmLabel="Apply template"
        cancelLabel="Keep current"
        onConfirm={() => pendingTemplate && applyTemplate(pendingTemplate)}
        onCancel={() => setPendingTemplate(null)}
      />
    </DndProvider>
  );
}
