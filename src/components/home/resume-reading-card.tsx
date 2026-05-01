import { GitCommit, Play } from "lucide-react";
import type { RecentlyReviewedWalkthrough } from "@/types/walkthrough";

interface ResumeReadingCardProps {
  walkthrough: RecentlyReviewedWalkthrough;
}

export function ResumeReadingCard({ walkthrough }: ResumeReadingCardProps) {
  const pct = Math.round(
    (walkthrough.readChapters / walkthrough.totalChapters) * 100,
  );

  return (
    <div className="rounded-xl bg-gradient-to-br from-violet-600 via-violet-600 to-indigo-700 p-5 mb-4 text-white shadow-md shadow-violet-200">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] font-bold uppercase tracking-widest bg-white/20 px-2.5 py-0.5 rounded-full">
              Resume Reading
            </span>
            <span className="text-xs text-violet-200">
              Chapter {walkthrough.readChapters} of {walkthrough.totalChapters}
            </span>
          </div>
          <h3 className="font-semibold text-[17px] leading-snug mb-3 pr-2">
            {walkthrough.title}
          </h3>
          <div className="flex items-center gap-2 mb-0.5">
            <div className="flex-1 h-1.5 bg-white/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-white rounded-full"
                style={{ width: `${pct}%` }}
              />
            </div>
            <span className="text-xs text-violet-200 shrink-0 w-8 text-right">
              {pct}%
            </span>
          </div>
          <p className="text-xs text-violet-300 flex items-center gap-1.5 mt-2">
            <GitCommit className="w-3 h-3 shrink-0" />
            {walkthrough.owner}/{walkthrough.repo} · #{walkthrough.prNumber}
          </p>
        </div>
        <button className="flex items-center gap-2 bg-white/15 hover:bg-white/25 active:bg-white/30 text-white text-sm font-medium px-4 py-2.5 rounded-xl transition-colors shrink-0 shadow-sm">
          <Play className="w-4 h-4 fill-white" />
          Continue
        </button>
      </div>
    </div>
  );
}
