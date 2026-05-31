"use client";

import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import { ChevronUp, ChevronDown, CheckCircle2 } from "lucide-react";
import type { Chapter } from "@/types/walkthrough";
import {
  useMarkChapterRead,
  useUnmarkChapterRead,
  useBatchFileComments,
  useRecordChapterView,
} from "@/hooks/use-walkthrough";
import { Button } from "@/components/ui/button";
import { FileSection } from "./file-section";
import { useChapterExpand } from "./chapter-expand-context";

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
  const markChapterRead = useMarkChapterRead(walkthroughId);
  const unmarkChapterRead = useUnmarkChapterRead(walkthroughId);
  const recordChapterView = useRecordChapterView(walkthroughId);

  // Register expand function with context so file panels can open this chapter
  const chapterExpand = useChapterExpand();
  const expand = useCallback(() => setExpanded(true), []);
  useEffect(() => {
    return chapterExpand?.register(chapter.id, expand);
  }, [chapterExpand, chapter.id, expand]);

  // Visibility-based time tracking
  const sectionRef = useRef<HTMLDivElement>(null);
  const activeStartRef = useRef<number | null>(null);
  const accumulatedRef = useRef(0);

  // Flush accumulated time to the server
  const flushTime = useCallback(() => {
    if (activeStartRef.current !== null) {
      accumulatedRef.current += (Date.now() - activeStartRef.current) / 1000;
      activeStartRef.current = null;
    }
    const secs = Math.round(accumulatedRef.current);
    if (secs > 0) {
      recordChapterView.mutate({
        chapterId: chapter.id,
        timeSpentSec: secs,
      });
      accumulatedRef.current = 0;
    }
  }, [chapter.id, recordChapterView]);

  // Track visibility via IntersectionObserver (reviewers only)
  const isVisibleRef = useRef(false);
  useEffect(() => {
    if (isOwner) return;
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisibleRef.current = entry.isIntersecting;
        if (entry.isIntersecting && expanded) {
          // Start tracking
          if (activeStartRef.current === null) {
            activeStartRef.current = Date.now();
          }
        } else {
          // Stop tracking
          if (activeStartRef.current !== null) {
            accumulatedRef.current +=
              (Date.now() - activeStartRef.current) / 1000;
            activeStartRef.current = null;
          }
        }
      },
      { threshold: 0.3 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [expanded, isOwner]);

  // When expanded changes, update tracking based on current visibility
  useEffect(() => {
    if (isOwner) return;
    if (expanded && isVisibleRef.current) {
      if (activeStartRef.current === null) {
        activeStartRef.current = Date.now();
      }
    } else {
      if (activeStartRef.current !== null) {
        accumulatedRef.current +=
          (Date.now() - activeStartRef.current) / 1000;
        activeStartRef.current = null;
      }
    }
  }, [expanded, isOwner]);

  // Flush on unmount or when user leaves the page (reviewers only)
  useEffect(() => {
    if (isOwner) return;
    const handleBeforeUnload = () => flushTime();
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      flushTime();
    };
  }, [flushTime, isOwner]);

  const fileIds = useMemo(
    () => chapter.files.map((f) => f.id),
    [chapter.files],
  );
  const { data: batchData } = useBatchFileComments(walkthroughId, fileIds);
  const commentsByFile = batchData?.data ?? {};

  const isPending = markChapterRead.isPending || unmarkChapterRead.isPending;

  function handleToggleRead() {
    if (isRead) {
      unmarkChapterRead.mutate(chapter.id);
    } else {
      markChapterRead.mutate(chapter.id);
    }
  }

  return (
    <div
      ref={sectionRef}
      id={`chapter-${chapter.id}`}
      className="bg-white rounded-xl border border-gray-200 overflow-hidden"
    >
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
          <Button
            variant={isRead ? "ghost" : "outline"}
            size="xs"
            className={`gap-2 rounded-xl transition-all duration-300 ease-in-out ${
              isRead
                ? "text-emerald-600 hover:text-emerald-600 hover:bg-emerald-50"
                : "border-2 border-primary text-primary hover:bg-primary/10 hover:text-primary"
            }`}
            onClick={handleToggleRead}
            disabled={isPending}
          >
            {isRead && (
              <CheckCircle2
                className={`w-4 h-4 transition-transform duration-300 ${isRead ? "scale-100" : "scale-0"}`}
              />
            )}
            <span className="transition-opacity duration-200">
              {isRead ? "Read" : "Mark as read"}
            </span>
          </Button>
        </div>
      )}
    </div>
  );
}
