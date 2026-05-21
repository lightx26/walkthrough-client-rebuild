import { BookOpen, CheckCircle2, Clock, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import type { RepoMetrics } from "@/types/analytics";

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

export function TeamOverviewCards({
  metrics,
  loading,
}: {
  metrics: RepoMetrics | undefined;
  loading: boolean;
}) {
  const s = metrics?.summary;
  const cards = [
    {
      icon: CheckCircle2,
      iconBg: "bg-emerald-50",
      iconColor: "text-emerald-600",
      label: "Avg completion rate",
      value: s ? pct(s.avgCompletionRate) : "—",
      hint: s ? `across ${s.totalReviews} review sessions` : null,
    },
    {
      icon: Clock,
      iconBg: "bg-violet-50",
      iconColor: "text-violet-600",
      label: "Avg time to complete",
      value: s ? formatDuration(s.avgTimeToCompleteSec) : "—",
      hint: s ? `${s.totalWalkthroughs} walkthroughs` : null,
    },
    {
      icon: BookOpen,
      iconBg: "bg-violet-50",
      iconColor: "text-violet-600",
      label: "Avg chapters / walkthrough",
      value: s ? s.avgChaptersPerWalkthrough.toFixed(1) : "—",
      hint: "last 30 days",
    },
    {
      icon: Users,
      iconBg: "bg-amber-50",
      iconColor: "text-amber-600",
      label: "Active reviewers",
      value: s ? String(s.activeReviewers) : "—",
      hint: "last 30 days",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
      {cards.map((c) => (
        <div
          key={c.label}
          className="bg-white border border-gray-200 rounded-xl px-4 py-3.5 flex items-start gap-3"
        >
          <div
            className={cn(
              "w-9 h-9 rounded-lg flex items-center justify-center shrink-0",
              c.iconBg,
            )}
          >
            <c.icon className={cn("w-4 h-4", c.iconColor)} />
          </div>
          <div className="min-w-0">
            <p className="text-[11px] text-gray-500 mb-0.5">{c.label}</p>
            <p className="text-xl font-bold text-gray-900 leading-tight">
              {loading ? "…" : c.value}
            </p>
            {c.hint && (
              <p className="text-[11px] text-gray-400 mt-0.5">{c.hint}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
