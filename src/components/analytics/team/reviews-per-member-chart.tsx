import type { RepoMember } from "@/types/analytics";

export function ReviewsPerMemberChart({ members }: { members: RepoMember[] }) {
  const max = Math.max(1, ...members.map((m) => m.walkthroughsReviewed));
  return (
    <div className="bg-white border border-gray-200 rounded-xl px-5 py-4">
      <h3 className="text-sm font-semibold text-gray-900">
        Reviews per member
      </h3>
      <p className="text-xs text-gray-500 mb-3">
        Completed vs. partial across all walkthroughs
      </p>
      {members.length === 0 ? (
        <div className="h-45 flex items-center justify-center text-xs text-gray-400">
          No reviewer activity yet
        </div>
      ) : (
        <div className="h-45 flex items-end gap-2 px-2">
          {members.slice(0, 8).map((m) => {
            const h = Math.max(8, (m.walkthroughsReviewed / max) * 150);
            return (
              <div
                key={m.userId}
                className="flex-1 flex flex-col items-center gap-1"
              >
                <span className="text-[10px] text-gray-500">
                  {m.walkthroughsReviewed}
                </span>
                <div
                  className="w-full rounded-t-md bg-violet-200"
                  style={{ height: `${h}px` }}
                />
                <span className="text-[10px] text-gray-500 uppercase">
                  {(m.username || "").slice(0, 2)}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
