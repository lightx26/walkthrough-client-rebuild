"use client";

import { useRef, useState } from "react";
import { useDrag } from "react-dnd";
import { ChevronDown, ChevronRight, Folder } from "lucide-react";
import { cn } from "@/lib/utils";
import type { PrFile } from "@/types/github";
import { PanelFileRow } from "./panel-file-row";
import { DRAG_TYPE_PR_DIR } from "./file-utils";

interface DirGroupProps {
  dir: string;
  files: PrFile[];
  assignedFilenames: Set<string>;
}

export function DirGroup({ dir, files, assignedFilenames }: DirGroupProps) {
  const [expanded, setExpanded] = useState(true);
  const dragRef = useRef<HTMLDivElement>(null);

  const unassignedFiles = files.filter(
    (f) => !assignedFilenames.has(f.filename),
  );
  const assignedCount = files.length - unassignedFiles.length;
  const dirLabel = dir ? dir.replace(/\/$/, "") : "(root)";

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
          {dirLabel}
        </span>
        {assignedCount > 0 && (
          <span className="text-[10px] text-gray-400 shrink-0">
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
            />
          ))}
        </div>
      )}
    </div>
  );
}
