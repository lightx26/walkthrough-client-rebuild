'use client';

import { useMemo, useState } from 'react';
import { ChevronDown, ChevronUp, RefreshCw, ShieldCheck } from 'lucide-react';
import type { RiskLevel, RiskScan } from '@/types/risk';
import type { Chapter } from '@/types/walkthrough';
import { useTriggerScan } from '@/hooks/use-risk';
import { Button } from '@/components/ui/button';
import { useChapterExpand } from '../chapter-expand-context';
import { AnalyzingProgress } from './analyzing-progress';
import { RiskCard } from './risk-card';
import { RiskFilterTabs, filterRisks } from './risk-filter-tabs';
import { SkippedFilesNotice } from './skipped-files-notice';

type FilterLevel = 'ALL' | RiskLevel;

interface RiskAnalysisPanelProps {
  walkthroughId: string;
  scan: RiskScan;
  chapters?: Chapter[];
}

export function RiskAnalysisPanel({ walkthroughId, scan, chapters = [] }: RiskAnalysisPanelProps) {
  const [activeFilter, setActiveFilter] = useState<FilterLevel>('ALL');
  const [resultsOpen, setResultsOpen] = useState(false);
  const trigger = useTriggerScan(walkthroughId);
  const chapterExpand = useChapterExpand();

  const fileIdToChapterId = useMemo(() => {
    const map: Record<string, string> = {};
    for (const ch of chapters) {
      for (const f of ch.files) {
        map[f.id] = ch.id;
      }
    }
    return map;
  }, [chapters]);

  const handleFileClick = (walkthroughFileId: string) => {
    const chapterId = fileIdToChapterId[walkthroughFileId];
    if (chapterId && chapterExpand) {
      chapterExpand.expandAndScrollToFile(chapterId, walkthroughFileId);
    } else {
      const el = document.getElementById(`file-${walkthroughFileId}`);
      el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const isScanning = scan.status === 'PENDING' || scan.status === 'ANALYZING';
  const hasResults = scan.status === 'COMPLETED' && scan.risks.length > 0;
  const visibleRisks = filterRisks(scan.risks, activeFilter);
  const skippedFiles = scan.fileProgress.filter((f) => f.status === 'skipped');

  const modelLabel = [scan.provider, scan.model].filter(Boolean).join(' · ');

  return (
    <div className="space-y-4">
      {/* Header card */}
      <div className="rounded-xl border border-gray-200 bg-white p-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-purple-600" />
              <span className="font-semibold text-gray-900">Risk Analysis</span>
              {modelLabel && (
                <span className="text-xs text-gray-400">
                  {modelLabel} · {scan.totalFiles} files analyzed
                </span>
              )}
            </div>
            {scan.status === 'COMPLETED' && (
              <div className="mt-2 flex items-center gap-2">
                {scan.counts.critical > 0 && (
                  <Chip label={`${scan.counts.critical} critical`} color="red" />
                )}
                {scan.counts.high > 0 && (
                  <Chip label={`${scan.counts.high} high`} color="orange" />
                )}
                {scan.counts.medium > 0 && (
                  <Chip label={`${scan.counts.medium} medium`} color="amber" />
                )}
                {scan.counts.low > 0 && (
                  <Chip label={`${scan.counts.low} low`} color="blue" />
                )}
              </div>
            )}
          </div>
          <div className="flex items-center gap-1">
            {!isScanning && (
              <Button
                variant="ghost"
                size="sm"
                className="gap-1.5 text-gray-500"
                onClick={() => trigger.mutate()}
                disabled={trigger.isPending}
              >
                <RefreshCw className="h-3.5 w-3.5" />
                Re-scan
              </Button>
            )}
            {hasResults && (
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-gray-600"
                onClick={() => setResultsOpen((v) => !v)}
                aria-label={resultsOpen ? 'Collapse results' : 'Expand results'}
              >
                {resultsOpen ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Progress overlay while scanning */}
      {isScanning && scan.fileProgress.length > 0 && (
        <AnalyzingProgress fileProgress={scan.fileProgress} />
      )}

      {/* Files excluded from analysis — shown once scanning settles (the progress list covers them while scanning) */}
      {!isScanning && <SkippedFilesNotice files={skippedFiles} />}

      {/* Results — collapsible */}
      {hasResults && resultsOpen && (
        <div className="space-y-3">
          <RiskFilterTabs risks={scan.risks} active={activeFilter} onChange={setActiveFilter} />
          <div className="space-y-3">
            {visibleRisks.map((risk) => (
              <RiskCard
                key={risk.id}
                risk={risk}
                walkthroughId={walkthroughId}
                onFileClick={handleFileClick}
              />
            ))}
          </div>
        </div>
      )}

      {scan.status === 'COMPLETED' && scan.risks.length === 0 && (
        <div className="rounded-xl border border-green-100 bg-green-50 p-4 text-center text-sm text-green-700">
          No risks detected in this walkthrough.
        </div>
      )}

      {scan.status === 'FAILED' && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          Risk analysis failed. Try re-scanning.
        </div>
      )}
    </div>
  );
}

function Chip({ label, color }: { label: string; color: 'red' | 'orange' | 'amber' | 'blue' }) {
  const styles = {
    red:    'bg-red-100 text-red-700',
    orange: 'bg-orange-100 text-orange-700',
    amber:  'bg-amber-100 text-amber-700',
    blue:   'bg-blue-100 text-blue-700',
  };
  return (
    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${styles[color]}`}>
      {label}
    </span>
  );
}
