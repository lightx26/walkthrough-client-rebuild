"use client";

import { useRef } from "react";
import { useDrag } from "react-dnd";
import {
  FileText,
  FileCode2,
  Settings,
  CheckCircle2,
  GripVertical,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { PrFile } from "@/types/github";
import { DRAG_TYPE_PR_FILE, statusBadge, baseName } from "./file-utils";

function getFileIcon(filename: string) {
  const ext = filename.split(".").pop()?.toLowerCase();
  if (ext === "sql")
    return <FileCode2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />;
  if (ext === "yml" || ext === "yaml")
    return <Settings className="w-3.5 h-3.5 text-green-500 shrink-0" />;
  return <FileText className="w-3.5 h-3.5 text-orange-400 shrink-0" />;
}

interface PanelFileRowProps {
  file: PrFile;
  assigned: boolean;
}

export function PanelFileRow({ file, assigned }: PanelFileRowProps) {
  const badge = statusBadge(file.status);
  const nodeRef = useRef<HTMLDivElement>(null);

  const [{ isDragging }, drag] = useDrag({
    type: DRAG_TYPE_PR_FILE,
    item: { type: DRAG_TYPE_PR_FILE, file },
    canDrag: !assigned,
    collect: (monitor) => ({ isDragging: monitor.isDragging() }),
  });

  drag(nodeRef);

  return (
    <div
      ref={nodeRef}
      className={cn(
        "flex items-center gap-2 px-3 py-1.5 rounded-md transition-colors",
        assigned
          ? "opacity-50"
          : "hover:bg-gray-100 cursor-grab active:cursor-grabbing",
        isDragging && "opacity-30",
      )}
    >
      {assigned ? (
        <CheckCircle2 className="w-3.5 h-3.5 text-gray-400 shrink-0" />
      ) : (
        <GripVertical className="w-3.5 h-3.5 text-gray-300 shrink-0" />
      )}
      {getFileIcon(file.filename)}
      <span
        className={cn(
          "flex-1 min-w-0 text-xs font-mono truncate",
          assigned ? "text-gray-400" : "text-gray-700",
        )}
      >
        {baseName(file.filename)}
      </span>
      {!assigned && (file.additions > 0 || file.deletions > 0) && (
        <span className="text-[10px] font-mono shrink-0">
          <span className="text-green-600">+{file.additions}</span>{" "}
          <span className="text-red-400">-{file.deletions}</span>
        </span>
      )}
      <span
        className={cn(
          "text-[10px] font-bold px-1 py-0.5 rounded shrink-0",
          badge.cls,
        )}
      >
        {badge.label}
      </span>
    </div>
  );
}
