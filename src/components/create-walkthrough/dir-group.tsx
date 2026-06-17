'use client';

import { useRef, useState } from 'react';

import { cn } from '@/lib/utils';
import type { PrFile } from '@/types/github';
import { ChevronDown, ChevronRight, Folder } from 'lucide-react';
import { useDrag } from 'react-dnd';

import { DRAG_TYPE_PR_DIR } from './file-utils';
import { PanelFileRow } from './panel-file-row';

interface DirGroupProps {
  dir: string;
  files: PrFile[];
  assignedFilenames: Set<string>;
  onClick?: (file: PrFile) => void;
}

export function DirGroup({ dir, files, assignedFilenames, onClick }: DirGroupProps) {
  const [expanded, setExpanded] = useState(true);
  const dragRef = useRef<HTMLDivElement>(null);

  const unassignedFiles = files.filter((f) => !assignedFilenames.has(f.filename));
  const assignedCount = files.length - unassignedFiles.length;
  const dirLabel = dir ? dir.replace(/\/$/, '') : '(root)';

  const [{ isDragging }, drag] = useDrag({
    type: DRAG_TYPE_PR_DIR,
    item: { type: DRAG_TYPE_PR_DIR, dir, files: unassignedFiles },
    canDrag: unassignedFiles.length > 0,
    collect: (monitor) => ({ isDragging: monitor.isDragging() }),
  });

  drag(dragRef);

  return (
    <div>
      <div
        ref={dragRef}
        title={dirLabel}
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
        <span className="flex-1 truncate text-left text-xs font-medium text-gray-600">
          {dirLabel}
        </span>
        {assignedCount > 0 && (
          <span className="shrink-0 text-[10px] text-gray-400">
            {assignedCount}/{files.length}
          </span>
        )}
      </div>
      {expanded && (
        <div className="ml-2">
          {files.map((file) => (
            <PanelFileRow
              key={file.filename}
              file={file}
              assigned={assignedFilenames.has(file.filename)}
              onClick={onClick}
            />
          ))}
        </div>
      )}
    </div>
  );
}
