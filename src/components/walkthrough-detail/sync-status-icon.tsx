import { AlertCircle, CheckCircle2, Circle } from 'lucide-react';

export function SyncStatusIcon({ status }: { status: string }) {
  switch (status) {
    case 'synced':
      return (
        <span title="Synced to GitHub">
          <CheckCircle2 className="h-3 w-3 text-green-500" />
        </span>
      );
    case 'pending':
      return (
        <span title="Not synced">
          <Circle className="h-3 w-3 text-gray-400" />
        </span>
      );
    case 'failed':
      return (
        <span title="Sync failed">
          <AlertCircle className="h-3 w-3 text-red-500" />
        </span>
      );
    default:
      return (
        <span title="Not synced">
          <Circle className="h-3 w-3 text-gray-300" />
        </span>
      );
  }
}
