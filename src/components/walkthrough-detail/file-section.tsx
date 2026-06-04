'use client';

import { useState } from 'react';

import type { WalkthroughComment, WalkthroughFile } from '@/types/walkthrough';
import type { RiskZone } from '@/types/risk';
import { ChevronDown, ChevronUp, FileText } from 'lucide-react';

import { Button } from '@/components/ui/button';

import { computeDiffStats } from '../../utils/code-diff-utils';
import { DiffViewer } from './diff-viewer';
import { FileRiskBadge } from './risk/file-risk-badge';

interface FileSectionProps {
  file: WalkthroughFile;
  walkthroughId: string;
  comments: WalkthroughComment[];
  risks?: RiskZone[];
}

export function FileSection({ file, walkthroughId, comments, risks = [] }: FileSectionProps) {
  const [expanded, setExpanded] = useState(true);
  const stats = file.rawPatch ? computeDiffStats(file.rawPatch) : null;

  return (
    <div id={`file-${file.id}`} className="bg-gray-50">
      {/* File header */}
      <Button
        variant="ghost"
        size="none"
        className="w-full justify-start gap-2 rounded-none px-6 py-2.5 text-left font-normal"
        onClick={() => setExpanded((v) => !v)}
      >
        <FileText className="h-4 w-4 shrink-0 text-orange-500" />
        <span
          className="min-w-0 flex-1 truncate font-mono text-sm font-medium text-gray-700"
          title={file.filename}
        >
          {file.filename}
        </span>
        {risks.length > 0 && <FileRiskBadge risks={risks} />}
        {stats && (
          <span className="shrink-0 font-mono text-xs font-medium">
            <span className="text-green-600">+{stats.added}</span>{' '}
            <span className="text-red-500">-{stats.removed}</span>
          </span>
        )}
        {expanded ? (
          <ChevronUp className="h-4 w-4 shrink-0 text-gray-400" />
        ) : (
          <ChevronDown className="h-4 w-4 shrink-0 text-gray-400" />
        )}
      </Button>

      {/* Diff — animated collapse */}
      <div
        className={`grid transition-all duration-300 ease-in-out ${
          expanded ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
        }`}
      >
        <div className="overflow-hidden">
          {file.rawPatch ? (
            <div className="mx-4 mb-3 overflow-hidden rounded-lg border border-gray-200">
              <DiffViewer
                rawPatch={file.rawPatch}
                walkthroughId={walkthroughId}
                fileId={file.id}
                comments={comments}
                filename={file.filename}
              />
            </div>
          ) : (
            <p className="px-6 pb-3 text-xs text-gray-400">No diff available.</p>
          )}
        </div>
      </div>
    </div>
  );
}
