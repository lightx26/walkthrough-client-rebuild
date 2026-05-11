"use client";

import { useRef, useState } from "react";
import { useDrag } from "react-dnd";
import { ChevronDown, ChevronRight, Folder } from "lucide-react";
import { cn } from "@/lib/utils";
import type { PrFile } from "@/types/github";
import { DirGroup } from "./dir-group";
import { PanelFileRow } from "./panel-file-row";
import { DRAG_TYPE_PR_DIR } from "./file-utils";

function dirOf(filename: string) {
  const slash = filename.lastIndexOf("/");
  return slash === -1 ? "" : filename.slice(0, slash + 1);
}

interface ChangedFilesPanelProps {
  files: PrFile[];
  assignedFilenames: Set<string>;
  repo: string;
  prNumber: number;
  isLoading: boolean;
}

export function ChangedFilesPanel({
  files,
  assignedFilenames,
  repo,
  prNumber,
  isLoading,
}: ChangedFilesPanelProps) {
  const assignedCount = assignedFilenames.size;
  const totalCount = files.length;
  const progressPct =
    totalCount === 0 ? 0 : Math.round((assignedCount / totalCount) * 100);

  const rootFiles: PrFile[] = [];
  const dirGroups = new Map<string, PrFile[]>();
  for (const file of files) {
    const dir = dirOf(file.filename);
    if (dir === "") {
      rootFiles.push(file);
    } else {
      if (!dirGroups.has(dir)) dirGroups.set(dir, []);
      dirGroups.get(dir)!.push(file);
    }
  }
  const sortedDirs = Array.from(dirGroups.entries()).sort(([a], [b]) =>
    a.localeCompare(b),
  );

  return (
    <div className="w-68 shrink-0 border-r border-gray-200 bg-white flex flex-col min-h-0">
      {/* Header */}
      <div className="px-4 py-3.5 border-b border-gray-100 shrink-0">
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm font-semibold text-gray-900">
            Changed files
          </span>
          <span className="text-xs text-gray-500 bg-gray-100 rounded-full px-1.5 py-0.5 font-medium">
            {totalCount}
          </span>
        </div>
        <p className="text-xs text-gray-400 mb-2">
          {repo} · #{prNumber}
        </p>
        <p className="text-xs text-gray-500 mb-1.5">
          {assignedCount} of {totalCount} assigned
        </p>
        <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-violet-500 rounded-full transition-all duration-300"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      {/* File tree */}
      <div className="flex-1 overflow-y-auto py-2 px-1">
        {isLoading ? (
          <div className="space-y-2 px-3 py-2">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="h-4 bg-gray-100 rounded animate-pulse"
                style={{ width: `${60 + (i % 3) * 15}%` }}
              />
            ))}
          </div>
        ) : (
          <RootGroup
            allFiles={files}
            rootFiles={rootFiles}
            sortedDirs={sortedDirs}
            assignedFilenames={assignedFilenames}
          />
        )}
      </div>
    </div>
  );
}

interface RootGroupProps {
  allFiles: PrFile[];
  rootFiles: PrFile[];
  sortedDirs: [string, PrFile[]][];
  assignedFilenames: Set<string>;
}

function RootGroup({
  allFiles,
  rootFiles,
  sortedDirs,
  assignedFilenames,
}: RootGroupProps) {
  const [expanded, setExpanded] = useState(true);
  const dragRef = useRef<HTMLDivElement>(null);

  const unassignedFiles = allFiles.filter(
    (f) => !assignedFilenames.has(f.filename),
  );
  const assignedInRoot = allFiles.length - unassignedFiles.length;

  const [{ isDragging }, drag] = useDrag({
    type: DRAG_TYPE_PR_DIR,
    item: { type: DRAG_TYPE_PR_DIR, dir: "(root)", files: unassignedFiles },
    canDrag: unassignedFiles.length > 0,
    collect: (monitor) => ({ isDragging: monitor.isDragging() }),
  });

  drag(dragRef);

  if (allFiles.length === 0) return null;

  return (
    <div>
      <div
        ref={dragRef}
        title="(root)"
        onClick={() => setExpanded((v) => !v)}
        className={cn(
          "w-full flex items-center gap-1.5 px-3 py-1.5 hover:bg-gray-100 rounded-md transition-colors select-none",
          unassignedFiles.length > 0
            ? "cursor-grab active:cursor-grabbing"
            : "cursor-pointer",
          isDragging && "opacity-30",
        )}
      >
        {expanded ? (
          <ChevronDown className="w-3.5 h-3.5 text-gray-400 shrink-0" />
        ) : (
          <ChevronRight className="w-3.5 h-3.5 text-gray-400 shrink-0" />
        )}
        <Folder className="w-3.5 h-3.5 text-gray-400 shrink-0" />
        <span className="text-xs font-medium text-gray-600 flex-1 text-left truncate">
          (root)
        </span>
        {assignedInRoot > 0 && (
          <span className="text-[10px] text-gray-400 shrink-0">
            {assignedInRoot}/{allFiles.length}
          </span>
        )}
      </div>
      {expanded && (
        <div className="ml-2">
          {rootFiles.map((file) => (
            <PanelFileRow
              key={file.filename}
              file={file}
              assigned={assignedFilenames.has(file.filename)}
            />
          ))}
          {sortedDirs.map(([dir, dirFiles]) => (
            <DirGroup
              key={dir}
              dir={dir}
              files={dirFiles}
              assignedFilenames={assignedFilenames}
            />
          ))}
        </div>
      )}
    </div>
  );
}
