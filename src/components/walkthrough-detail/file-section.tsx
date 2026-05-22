"use client";

import { useState } from "react";
import { ChevronUp, ChevronDown, FileText } from "lucide-react";
import type { WalkthroughFile } from "@/types/walkthrough";
import { useFileComments } from "@/hooks/use-walkthrough";
import { Button } from "@/components/ui/button";
import { DiffViewer } from "./diff-viewer";
import { computeDiffStats } from "./diff-utils";

interface FileSectionProps {
  file: WalkthroughFile;
  walkthroughId: string;
}

export function FileSection({ file, walkthroughId }: FileSectionProps) {
  const [expanded, setExpanded] = useState(true);
  const stats = file.rawPatch ? computeDiffStats(file.rawPatch) : null;

  const { data } = useFileComments(walkthroughId, file.id);
  const comments = data?.data?.items ?? [];

  return (
    <div id={`file-${file.id}`} className="bg-gray-50">
      {/* File header */}
      <Button
        variant="ghost"
        size="none"
        className="w-full justify-start gap-2 px-6 py-2.5 rounded-none text-left font-normal"
        onClick={() => setExpanded((v) => !v)}
      >
        <FileText className="w-4 h-4 text-orange-500 shrink-0" />
        <span className="text-sm font-medium text-gray-700 font-mono flex-1 truncate min-w-0">
          {file.filename}
        </span>
        {stats && (
          <span className="text-xs font-mono font-medium shrink-0">
            <span className="text-green-600">+{stats.added}</span>
            {" "}
            <span className="text-red-500">-{stats.removed}</span>
          </span>
        )}
        {expanded ? (
          <ChevronUp className="w-4 h-4 text-gray-400 shrink-0" />
        ) : (
          <ChevronDown className="w-4 h-4 text-gray-400 shrink-0" />
        )}
      </Button>

      {/* Diff — animated collapse */}
      <div
        className={`grid transition-all duration-300 ease-in-out ${
          expanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          {file.rawPatch ? (
            <div className="mx-4 mb-3 rounded-lg border border-gray-200 overflow-hidden">
              <DiffViewer
                rawPatch={file.rawPatch}
                walkthroughId={walkthroughId}
                fileId={file.id}
                comments={comments}
                filename={file.filename}
              />
            </div>
          ) : (
            <p className="px-6 pb-3 text-xs text-gray-400">No diff available.</p>
          )}
        </div>
      </div>
    </div>
  );
}
