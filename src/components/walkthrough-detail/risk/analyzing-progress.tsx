'use client';

import { Check, Loader2, MinusCircle, X } from 'lucide-react';
import type { RiskFileProgress } from '@/types/risk';

interface AnalyzingProgressProps {
  fileProgress: RiskFileProgress[];
}

export function AnalyzingProgress({ fileProgress }: AnalyzingProgressProps) {
  return (
    <div className="rounded-xl border border-purple-100 bg-purple-50 p-4">
      <div className="mb-3 flex items-center gap-2 text-purple-700">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span className="font-semibold text-sm">Analyzing PR with AI...</span>
      </div>
      <p className="mb-3 text-xs text-purple-600">
        Scanning {fileProgress.length} files for breaking changes, race conditions, and data integrity issues...
      </p>
      <ul className="space-y-1.5">
        {fileProgress.map((f) => (
          <li key={f.filename} className="flex items-center justify-between text-sm">
            <span className="text-gray-700 truncate">{f.filename}</span>
            <FileStatusIcon status={f.status} reason={f.reason} />
          </li>
        ))}
      </ul>
    </div>
  );
}

function FileStatusIcon({ status, reason }: { status: RiskFileProgress['status']; reason?: string }) {
  switch (status) {
    case 'done':
      return <span className="flex items-center gap-1 text-green-600 text-xs"><Check className="h-3.5 w-3.5" />done</span>;
    case 'analyzing':
      return <span className="flex items-center gap-1 text-purple-600 text-xs"><Loader2 className="h-3.5 w-3.5 animate-spin" />analyzing...</span>;
    case 'failed':
      return <span className="flex items-center gap-1 text-red-500 text-xs"><X className="h-3.5 w-3.5" />failed</span>;
    case 'skipped':
      return <span className="flex items-center gap-1 text-amber-600 text-xs" title={reason}><MinusCircle className="h-3.5 w-3.5" />skipped</span>;
    default:
      return <span className="text-gray-400 text-xs">pending</span>;
  }
}
