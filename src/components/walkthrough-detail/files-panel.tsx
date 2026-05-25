"use client";

import { useState } from "react";
import { X, FileText, LayoutList } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import type { Walkthrough } from "@/types/walkthrough";
import { computeDiffStats } from "./diff-viewer";

function statusBadge(fileStatus: string) {
  const s = fileStatus?.toUpperCase();
  if (s === "ADDED") return { label: "A", cls: "bg-green-100 text-green-700" };
  if (s === "DELETED") return { label: "D", cls: "bg-red-100 text-red-700" };
  return { label: "M", cls: "bg-blue-100 text-blue-700" };
}

function scrollToFile(fileId: string) {
  const el = document.getElementById(`file-${fileId}`);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}

interface FilesPanelProps {
  walkthrough: Walkthrough;
}

export function FilesPanel({ walkthrough }: FilesPanelProps) {
  const [open, setOpen] = useState(false);

  const totalFiles = walkthrough.chapters.reduce(
    (n, ch) => n + ch.files.length,
    0,
  );

  return (
    <>
      {/* Floating toggle button */}
      {!open && (
        <Button
          variant="outline"
          size="none"
          onClick={() => setOpen(true)}
          className="fixed right-6 top-1/2 -translate-y-1/2 gap-1.5 px-3 py-2 shadow-md text-sm text-gray-600 hover:border-violet-400 hover:text-violet-700 font-medium z-30"
        >
          <LayoutList className="w-4 h-4" />
          <span>Files</span>
        </Button>
      )}

      {/* Panel */}
      {open && (
        <div className="fixed right-6 top-22 z-40 w-72 bg-white border border-gray-200 rounded-xl shadow-xl flex flex-col max-h-[calc(100vh-7rem)]">
          {/* Header */}
          <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-100 shrink-0">
            <LayoutList className="w-4 h-4 text-gray-500" />
            <span className="font-semibold text-sm text-gray-900 flex-1">
              Walkthrough files
            </span>
            <span className="text-xs font-semibold text-white bg-blue-500 rounded-full px-1.5 py-0.5 min-w-5 text-center">
              {totalFiles}
            </span>
            <Button
              variant="ghost"
              size="none"
              onClick={() => setOpen(false)}
              className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 ml-1"
            >
              <X className="w-3.5 h-3.5" />
            </Button>
          </div>

          {/* File list */}
          <div className="overflow-y-auto flex-1 py-2">
            {walkthrough.chapters.map((chapter, chIdx) => (
              <div key={chapter.id}>
                {/* Chapter row */}
                <div className="flex items-center gap-2 px-4 py-2">
                  <span className="shrink-0 w-5 h-5 rounded-full bg-violet-600 text-white text-[10px] font-bold flex items-center justify-center">
                    {chIdx + 1}
                  </span>
                  <span className="text-xs font-medium text-gray-700 truncate">
                    {chapter.title}
                  </span>
                </div>

                {/* File rows */}
                {chapter.files.map((file) => {
                  const badge = statusBadge(file.fileStatus);
                  const stats = file.rawPatch
                    ? computeDiffStats(file.rawPatch)
                    : null;
                  const shortName =
                    file.filename.split("/").pop() ?? file.filename;

                  return (
                    <Button
                      key={file.id}
                      variant="ghost"
                      size="none"
                      onClick={() => {
                        scrollToFile(file.id);
                      }}
                      className="w-full justify-start gap-2 pl-10 pr-4 py-1.5 rounded-none font-normal hover:bg-violet-50 group"
                    >
                      <FileText className="w-3.5 h-3.5 text-orange-400 shrink-0" />
                      <span className="text-xs text-gray-600 group-hover:text-violet-700 truncate flex-1 font-mono">
                        {shortName}
                      </span>
                      <span
                        className={cn(
                          "text-[10px] font-bold px-1 py-0.5 rounded shrink-0",
                          badge.cls,
                        )}
                      >
                        {badge.label}
                      </span>
                      {stats && (
                        <span className="text-[10px] font-mono text-green-600 shrink-0">
                          +{stats.added}
                        </span>
                      )}
                    </Button>
                  );
                })}
              </div>
            ))}
          </div>

          {/* Close button */}
          <div className="border-t border-gray-100 px-4 py-3 shrink-0 flex justify-end">
            <Button
              variant="primary"
              size="xs"
              onClick={() => setOpen(false)}
              className="rounded-lg"
            >
              Close
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
