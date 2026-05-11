"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";
import type { Chapter } from "@/types/walkthrough";
import { useRecordChapterView } from "@/hooks/use-walkthrough";
import { FileSection } from "./file-section";

interface ChapterSectionProps {
  chapter: Chapter;
  index: number;
  walkthroughId: string;
}

export function ChapterSection({ chapter, index, walkthroughId }: ChapterSectionProps) {
  const [expanded, setExpanded] = useState(index === 0);
  const viewRecorded = useRef(false);
  const recordChapterView = useRecordChapterView(walkthroughId);

  useEffect(() => {
    if (expanded && !viewRecorded.current) {
      viewRecorded.current = true;
      recordChapterView.mutate({
        chapterId: chapter.id,
        timeSpentSec: 0,
        scrolledToBottom: false,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [expanded, chapter.id]);

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      {/* Chapter header */}
      <button
        className="w-full flex items-start gap-4 px-6 py-4 hover:bg-gray-50 transition-colors text-left"
        onClick={() => setExpanded((v) => !v)}
      >
        <span className="shrink-0 w-7 h-7 rounded-full bg-violet-600 text-white text-sm font-bold flex items-center justify-center mt-0.5">
          {index + 1}
        </span>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-gray-900 leading-snug">{chapter.title}</p>
          {chapter.description && (
            <p className="text-sm text-gray-500 mt-0.5 leading-snug">{chapter.description}</p>
          )}
        </div>
        <div className="flex items-center gap-2 shrink-0 text-sm text-gray-400 mt-0.5">
          <span>{chapter.files.length} {chapter.files.length === 1 ? "file" : "files"}</span>
          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </button>

      {/* Files — animated collapse */}
      <div
        className={`grid transition-all duration-300 ease-in-out ${
          expanded && chapter.files.length > 0 ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <div className="border-t border-gray-100 divide-y divide-gray-100">
            {chapter.files.map((file) => (
              <FileSection key={file.id} file={file} walkthroughId={walkthroughId} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
