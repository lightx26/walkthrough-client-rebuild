'use client';

import { useRef, useState } from 'react';

import { cn } from '@/lib/utils';
import type { PrFile } from '@/types/github';
import { ChevronDown, ChevronRight, Folder } from 'lucide-react';
import { useDrag } from 'react-dnd';

import { DirGroup } from './dir-group';
import { DRAG_TYPE_PR_DIR } from './file-utils';
import { PanelFileRow } from './panel-file-row';

function dirOf(filename: string) {
  const slash = filename.lastIndexOf('/');
  return slash === -1 ? '' : filename.slice(0, slash + 1);
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
  const progressPct = totalCount === 0 ? 0 : Math.round((assignedCount / totalCount) * 100);

  const rootFiles: PrFile[] = [];
  const dirGroups = new Map<string, PrFile[]>();
  for (const file of files) {
    const dir = dirOf(file.filename);
    if (dir === '') {
      rootFiles.push(file);
    } else {
      if (!dirGroups.has(dir)) dirGroups.set(dir, []);
      dirGroups.get(dir)!.push(file);
    }
  }
  const sortedDirs = Array.from(dirGroups.entries()).sort(([a], [b]) => a.localeCompare(b));

  return (
    <div className="flex min-h-0 w-68 shrink-0 flex-col border-r border-gray-200 bg-white">
      {/* Header */}
      <div className="shrink-0 border-b border-gray-100 px-4 py-3.5">
        <div className="mb-1 flex items-center justify-between">
          <span className="text-sm font-semibold text-gray-900">Changed files</span>
          <span className="rounded-full bg-gray-100 px-1.5 py-0.5 text-xs font-medium text-gray-500">
            {totalCount}
          </span>
        </div>
        <p className="mb-2 text-xs text-gray-400">
          {repo} · #{prNumber}
        </p>
        <p className="mb-1.5 text-xs text-gray-500">
          {assignedCount} of {totalCount} assigned
        </p>
        <div className="h-1 overflow-hidden rounded-full bg-gray-100">
          <div
            className="h-full rounded-full bg-violet-500 transition-all duration-300"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      {/* File tree */}
      <div className="flex-1 overflow-y-auto px-1 py-2">
        {isLoading ? (
          <div className="space-y-2 px-3 py-2">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="h-4 animate-pulse rounded bg-gray-100"
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

function RootGroup({ allFiles, rootFiles, sortedDirs, assignedFilenames }: RootGroupProps) {
  const [expanded, setExpanded] = useState(true);
  const dragRef = useRef<HTMLDivElement>(null);

  const unassignedFiles = allFiles.filter((f) => !assignedFilenames.has(f.filename));
  const assignedInRoot = allFiles.length - unassignedFiles.length;

  const [{ isDragging }, drag] = useDrag({
    type: DRAG_TYPE_PR_DIR,
    item: { type: DRAG_TYPE_PR_DIR, dir: '(root)', files: unassignedFiles },
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
          'flex w-full items-center gap-1.5 rounded-md px-3 py-1.5 transition-colors select-none hover:bg-gray-100',
          unassignedFiles.length > 0 ? 'cursor-grab active:cursor-grabbing' : 'cursor-pointer',
          isDragging && 'opacity-30'
        )}
      >
        {expanded ? (
          <ChevronDown className="h-3.5 w-3.5 shrink-0 text-gray-400" />
        ) : (
          <ChevronRight className="h-3.5 w-3.5 shrink-0 text-gray-400" />
        )}
        <Folder className="h-3.5 w-3.5 shrink-0 text-gray-400" />
        <span className="flex-1 truncate text-left text-xs font-medium text-gray-600">(root)</span>
        {assignedInRoot > 0 && (
          <span className="shrink-0 text-[10px] text-gray-400">
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
            <DirGroup key={dir} dir={dir} files={dirFiles} assignedFilenames={assignedFilenames} />
          ))}
        </div>
      )}
    </div>
  );
}
