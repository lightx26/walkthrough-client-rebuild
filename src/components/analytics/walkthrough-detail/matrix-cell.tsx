import { LoaderCircle, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ReviewerChapter } from "@/types/analytics";

type CellKind = "marked" | "viewed" | "untouched";

function cellKind(c: ReviewerChapter): CellKind {
  if (c.markedAsRead) return "marked";
  if (c.viewCount > 0) return "viewed";
  return "untouched";
}

export function MatrixCell({ chapter }: { chapter: ReviewerChapter }) {
  const kind = cellKind(chapter);
  if (kind === "untouched") {
    return (
      <div className="relative w-9 h-9 mx-auto rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center">
        <span className="text-gray-300 text-sm">—</span>
      </div>
    );
  }
  return (
    <div className="relative w-9 h-9 mx-auto">
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
          <LoaderCircle className="w-4 h-4" />
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
