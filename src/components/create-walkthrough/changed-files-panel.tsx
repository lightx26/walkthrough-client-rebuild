"use client";

import type { PrFile } from "@/types/github";
import { DirGroup } from "./dir-group";

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

  const groups = new Map<string, PrFile[]>();
  for (const file of files) {
    const dir = dirOf(file.filename);
    if (!groups.has(dir)) groups.set(dir, []);
    groups.get(dir)!.push(file);
  }

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
          Array.from(groups.entries()).map(([dir, dirFiles]) => (
            <DirGroup
              key={dir}
              dir={dir}
              files={dirFiles}
              assignedFilenames={assignedFilenames}
            />
          ))
        )}
      </div>
    </div>
  );
}
