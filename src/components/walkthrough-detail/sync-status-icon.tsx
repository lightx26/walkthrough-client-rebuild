import { CheckCircle2, Circle, AlertCircle } from "lucide-react";

export function SyncStatusIcon({ status }: { status: string }) {
  switch (status) {
    case "synced":
      return (
        <span title="Synced to GitHub">
          <CheckCircle2 className="w-3 h-3 text-green-500" />
        </span>
      );
    case "pending":
      return (
        <span title="Not synced">
          <Circle className="w-3 h-3 text-gray-400" />
        </span>
      );
    case "failed":
      return (
        <span title="Sync failed">
          <AlertCircle className="w-3 h-3 text-red-500" />
        </span>
      );
    default:
      return (
        <span title="Not synced">
          <Circle className="w-3 h-3 text-gray-300" />
        </span>
      );
  }
}
