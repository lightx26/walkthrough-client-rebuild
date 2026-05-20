import { Clock, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import { UserAvatar } from "@/components/ui/user-avatar";
import type { RepoMember } from "@/types/analytics";

function formatDuration(sec: number): string {
  if (!sec) return "0m";
  if (sec < 60) return `${sec}s`;
  const m = Math.round(sec / 60);
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  return `${h}h ${m % 60}m`;
}

function pct(rate: number): string {
  return `${Math.round(rate * 100)}%`;
}

function rateColor(rate: number): string {
  if (rate >= 0.8) return "bg-emerald-500";
  if (rate >= 0.6) return "bg-amber-400";
  return "bg-rose-400";
}

export function MemberActivityTable({ members }: { members: RepoMember[] }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl">
      <div className="px-5 py-4 flex items-center justify-between border-b border-gray-100">
        <div>
          <h3 className="text-sm font-semibold text-gray-900">
            Member activity summary
          </h3>
          <p className="text-xs text-gray-500">
            Historical aggregates — valid across accumulated review sessions
          </p>
        </div>
        <span className="text-[11px] text-gray-400">Last 30 days</span>
      </div>
      <div className="px-5 py-3">
        <div className="grid grid-cols-[1.5fr_1fr_1.4fr_0.8fr_0.6fr] gap-3 text-[10px] uppercase tracking-wider text-gray-400 px-2 py-2">
          <span>Member</span>
          <span>Walkthroughs reviewed</span>
          <span>Avg completion</span>
          <span>Avg time</span>
          <span>Comments left</span>
        </div>
        {members.length === 0 ? (
          <p className="text-xs text-gray-400 px-2 py-3">No data</p>
        ) : (
          members.map((m) => (
            <div
              key={m.userId}
              className="grid grid-cols-[1.5fr_1fr_1.4fr_0.8fr_0.6fr] gap-3 items-center text-sm px-2 py-3 border-t border-gray-100"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <UserAvatar
                  src={m.avatarUrl}
                  username={m.username}
                  displayName={m.displayName}
                  size="sm"
                />
                <div className="min-w-0">
                  <p className="text-gray-900 truncate">
                    {m.displayName || m.username}
                  </p>
                  <p className="text-[11px] text-gray-400 truncate">
                    @{m.username}
                  </p>
                </div>
              </div>
              <span className="text-gray-700">{m.walkthroughsReviewed}</span>
              <div className="flex items-center gap-2">
                <div className="h-2 rounded-full bg-gray-100 flex-1 overflow-hidden">
                  <div
                    className={cn("h-full", rateColor(m.avgCompletionRate))}
                    style={{
                      width: `${Math.round(m.avgCompletionRate * 100)}%`,
                    }}
                  />
                </div>
                <span className="text-xs text-gray-700 w-9 text-right">
                  {pct(m.avgCompletionRate)}
                </span>
              </div>
              <span className="inline-flex items-center gap-1 text-gray-600 text-xs">
                <Clock className="w-3 h-3 text-gray-400" />
                {formatDuration(m.avgTimeSpentSec)}
              </span>
              <span className="inline-flex items-center gap-1 text-violet-600 text-xs">
                <MessageSquare className="w-3 h-3" />
                {m.totalComments}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
