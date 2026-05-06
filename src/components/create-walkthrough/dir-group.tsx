"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import type { PrFile } from "@/types/github";
import { PanelFileRow } from "./panel-file-row";

interface DirGroupProps {
  dir: string;
  files: PrFile[];
  assignedFilenames: Set<string>;
}

export function DirGroup({ dir, files, assignedFilenames }: DirGroupProps) {
  const [expanded, setExpanded] = useState(true);
  const assignedCount = files.filter((f) =>
    assignedFilenames.has(f.filename),
  ).length;

  return (
    <div>
      <button
        onClick={() => setExpanded((v) => !v)}
        className="w-full flex items-center gap-1.5 px-3 py-1.5 hover:bg-gray-100 rounded-md transition-colors"
      >
        {expanded ? (
          <ChevronDown className="w-3.5 h-3.5 text-gray-400 shrink-0" />
        ) : (
          <ChevronRight className="w-3.5 h-3.5 text-gray-400 shrink-0" />
        )}
        <span className="text-xs font-medium text-gray-600 flex-1 text-left truncate">
          {dir || "(root)"}
        </span>
        {assignedCount > 0 && (
          <span className="text-[10px] text-gray-400 shrink-0">
            {assignedCount}/{files.length}
          </span>
        )}
      </button>
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
