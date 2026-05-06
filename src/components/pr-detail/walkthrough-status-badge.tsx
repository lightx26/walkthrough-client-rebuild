import type { WalkthroughStatus } from "@/types/walkthrough";

export function WalkthroughStatusBadge({
  status,
}: {
  status: WalkthroughStatus;
}) {
  if (status === "PUBLISHED")
    return (
      <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
        Published
      </span>
    );
  if (status === "DRAFT")
    return (
      <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
        Draft
      </span>
    );
  if (status === "OUTDATED")
    return (
      <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-orange-50 text-orange-700 border border-orange-200">
        Outdated
      </span>
    );
  return (
    <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 border border-gray-200">
      Deprecated
    </span>
  );
}
