'use client';

import { useState } from 'react';
import { RefreshCw, ShieldCheck } from 'lucide-react';
import type { RiskLevel, RiskScan } from '@/types/risk';
import { useTriggerScan } from '@/hooks/use-risk';
import { Button } from '@/components/ui/button';
import { AnalyzingProgress } from './analyzing-progress';
import { RiskCard } from './risk-card';
import { RiskFilterTabs, filterRisks } from './risk-filter-tabs';

type FilterLevel = 'ALL' | RiskLevel;

interface RiskAnalysisPanelProps {
  walkthroughId: string;
  scan: RiskScan;
}

export function RiskAnalysisPanel({ walkthroughId, scan }: RiskAnalysisPanelProps) {
  const [activeFilter, setActiveFilter] = useState<FilterLevel>('ALL');
  const trigger = useTriggerScan(walkthroughId);

  const isScanning = scan.status === 'PENDING' || scan.status === 'ANALYZING';
  const visibleRisks = filterRisks(scan.risks, activeFilter);

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
        </div>
      </div>

      {/* Progress overlay while scanning */}
      {isScanning && scan.fileProgress.length > 0 && (
        <AnalyzingProgress fileProgress={scan.fileProgress} />
      )}

      {/* Results */}
      {scan.status === 'COMPLETED' && scan.risks.length > 0 && (
        <div className="space-y-3">
          <RiskFilterTabs risks={scan.risks} active={activeFilter} onChange={setActiveFilter} />
          <div className="space-y-3">
            {visibleRisks.map((risk) => (
              <RiskCard key={risk.id} risk={risk} walkthroughId={walkthroughId} />
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
