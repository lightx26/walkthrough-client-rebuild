'use client';

import { useState } from 'react';
import { AlertTriangle, ChevronDown, ChevronUp } from 'lucide-react';
import type { RiskFileProgress } from '@/types/risk';

interface SkippedFilesNoticeProps {
  files: RiskFileProgress[];
}

/**
 * Warning badge listing files that were excluded from AI risk analysis (generated files,
 * oversized patches, files beyond the scan limit) so the user knows they weren't reviewed.
 */
export function SkippedFilesNotice({ files }: SkippedFilesNoticeProps) {
  const [open, setOpen] = useState(false);

  if (files.length === 0) return null;

  return (
    <div className="rounded-xl border border-amber-200 bg-amber-50 p-3">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-2 text-left"
        aria-expanded={open}
      >
        <span className="flex items-center gap-2 text-sm font-medium text-amber-800">
          <AlertTriangle className="h-4 w-4 text-amber-600" />
          {files.length} file{files.length > 1 ? 's' : ''} not analyzed
        </span>
        {open ? (
          <ChevronUp className="h-4 w-4 text-amber-600" />
        ) : (
          <ChevronDown className="h-4 w-4 text-amber-600" />
        )}
      </button>
      <p className="mt-1 text-xs text-amber-700">
        These files were excluded from AI analysis. Review them manually if needed.
      </p>
      {open && (
        <ul className="mt-2 space-y-1 border-t border-amber-200 pt-2">
          {files.map((f) => (
            <li key={f.filename} className="flex items-center justify-between gap-3 text-xs">
              <span className="truncate font-mono text-amber-900" title={f.filename}>
                {f.filename}
              </span>
              {f.reason && <span className="shrink-0 text-amber-600">{f.reason}</span>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
