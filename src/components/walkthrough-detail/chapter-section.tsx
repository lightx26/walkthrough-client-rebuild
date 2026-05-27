"use client";

import { useState, useMemo } from "react";
import { ChevronUp, ChevronDown, CheckCircle2 } from "lucide-react";
import type { Chapter } from "@/types/walkthrough";
import {
  useRecordChapterView,
  useUnmarkChapter,
  useBatchFileComments,
} from "@/hooks/use-walkthrough";
import { Button } from "@/components/ui/button";
import { FileSection } from "./file-section";

interface ChapterSectionProps {
  chapter: Chapter;
  index: number;
  walkthroughId: string;
  isOwner: boolean;
  isRead: boolean;
}

export function ChapterSection({
  chapter,
  index,
  walkthroughId,
  isOwner,
  isRead,
}: ChapterSectionProps) {
  const [expanded, setExpanded] = useState(index === 0);
  const recordChapterView = useRecordChapterView(walkthroughId);
  const unmarkChapter = useUnmarkChapter(walkthroughId);

  const fileIds = useMemo(
    () => chapter.files.map((f) => f.id),
    [chapter.files],
  );
  const { data: batchData } = useBatchFileComments(walkthroughId, fileIds);
  const commentsByFile = batchData?.data ?? {};

  const isPending = recordChapterView.isPending || unmarkChapter.isPending;

  function handleToggleRead() {
    if (isRead) {
      unmarkChapter.mutate(chapter.id);
    } else {
      recordChapterView.mutate({
        chapterId: chapter.id,
        markedAsRead: true,
      });
    }
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      {/* Chapter header */}
      <Button
        variant="ghost"
        size="none"
        className="w-full justify-start items-start gap-4 px-6 py-4 rounded-none text-left font-normal hover:bg-gray-50"
        onClick={() => setExpanded((v) => !v)}
      >
        <span className="shrink-0 w-7 h-7 rounded-full bg-violet-600 text-white text-sm font-bold flex items-center justify-center mt-0.5">
          {index + 1}
        </span>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-gray-900 leading-snug">
            {chapter.title}
          </p>
          {chapter.description && (
            <p className="text-sm text-gray-500 mt-0.5 leading-snug">
              {chapter.description}
            </p>
          )}
        </div>
        <div className="flex items-center gap-2 shrink-0 text-sm text-gray-400 mt-0.5">
          <span>
            {chapter.files.length}{" "}
            {chapter.files.length === 1 ? "file" : "files"}
          </span>
          {expanded ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </div>
      </Button>

      {/* Files — animated collapse */}
      <div
        className={`grid transition-all duration-300 ease-in-out ${
          expanded && chapter.files.length > 0
            ? "grid-rows-[1fr] opacity-100"
            : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <div className="border-t border-gray-100 divide-y divide-gray-100">
            {chapter.files.map((file) => (
              <FileSection
                key={file.id}
                file={file}
                walkthroughId={walkthroughId}
                comments={commentsByFile[file.id] ?? []}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Mark as Read — always visible */}
      {!isOwner && (
        <div className="border-t border-gray-100 px-6 py-3 flex justify-end">
          {isRead ? (
            <Button
              variant="ghost"
              size="sm"
              className="gap-2 rounded-xl text-emerald-600 hover:text-red-600 hover:bg-red-50"
              onClick={handleToggleRead}
              disabled={isPending}
            >
              <CheckCircle2 className="w-4 h-4" />
              Read
            </Button>
          ) : (
            <Button
              variant="primary"
              size="sm"
              className="gap-2 rounded-xl"
              onClick={handleToggleRead}
              disabled={isPending}
            >
              <CheckCircle2 className="w-4 h-4" />
              Mark as read
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
