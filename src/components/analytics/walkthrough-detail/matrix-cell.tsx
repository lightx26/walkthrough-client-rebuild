import { AlertCircle, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ReviewerChapter } from "@/types/analytics";

type CellKind = "marked" | "not-marked" | "unread";

function cellKind(c: ReviewerChapter): CellKind {
  if (!c.read) return "unread";
  if (c.markedAsRead) return "marked";
  return "not-marked";
}

export function MatrixCell({ chapter }: { chapter: ReviewerChapter }) {
  const kind = cellKind(chapter);
  if (kind === "unread") {
    return (
      <div className="w-9 h-9 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center">
        <span className="text-gray-300 text-sm">—</span>
      </div>
    );
  }
  return (
    <div className="flex items-center justify-center relative">
      <div
        className={cn(
          "w-9 h-9 rounded-lg border flex items-center justify-center",
          kind === "marked"
            ? "bg-emerald-50 border-emerald-200 text-emerald-600"
            : "bg-amber-50 border-amber-200 text-amber-600",
        )}
      >
        {kind === "marked" ? (
          <Check className="w-4 h-4" />
        ) : (
          <AlertCircle className="w-4 h-4" />
        )}
      </div>
      {chapter.commentCount > 0 && (
        <span className="absolute -top-1.5 -right-1.5 min-w-4 h-4 px-1 rounded-full bg-violet-600 text-white text-[9px] font-semibold flex items-center justify-center">
          {chapter.commentCount}
        </span>
      )}
    </div>
  );
}
