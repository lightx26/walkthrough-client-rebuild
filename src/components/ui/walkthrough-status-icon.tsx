import type { WalkthroughStatus } from "@/types/walkthrough";
import { cn } from "@/lib/utils";
import { Waypoints } from "lucide-react";

export function WalkthroughStatusIcon({
  status,
}: {
  status: WalkthroughStatus;
}) {
  const base = "w-9 h-9 rounded-full flex items-center justify-center shrink-0";
  if (status === "PUBLISHED")
    return (
      <div className={cn(base, "bg-emerald-50")}>
        <Waypoints className="w-4 h-4 text-emerald-600" strokeWidth={2} />
      </div>
    );
  if (status === "DRAFT")
    return (
      <div className={cn(base, "bg-amber-50")}>
        <Waypoints className="w-4 h-4 text-amber-600" strokeWidth={2} />
      </div>
    );
  if (status === "OUTDATED")
    return (
      <div className={cn(base, "bg-gray-100")}>
        <Waypoints className="w-4 h-4 text-gray-500" strokeWidth={2} />
      </div>
    );
  return (
    <div className={cn(base, "bg-gray-100")}>
      <Waypoints className="w-4 h-4 text-gray-400" strokeWidth={2} />
    </div>
  );
}
