'use client';

import { FileCode, Lightbulb } from 'lucide-react';
import type { RiskLevel, RiskZone } from '@/types/risk';
import { useMarkReviewed } from '@/hooks/use-risk';
import { Button } from '@/components/ui/button';

const LEVEL_STYLES: Record<RiskLevel, { border: string; levelBg: string; levelText: string }> = {
  CRITICAL: { border: 'border-red-200',    levelBg: 'bg-red-100',    levelText: 'text-red-700' },
  HIGH:     { border: 'border-orange-200', levelBg: 'bg-orange-100', levelText: 'text-orange-700' },
  MEDIUM:   { border: 'border-amber-200',  levelBg: 'bg-amber-100',  levelText: 'text-amber-700' },
  LOW:      { border: 'border-blue-200',   levelBg: 'bg-blue-100',   levelText: 'text-blue-700' },
};

interface RiskCardProps {
  risk: RiskZone;
  walkthroughId: string;
}

export function RiskCard({ risk, walkthroughId }: RiskCardProps) {
  const styles = LEVEL_STYLES[risk.level];
  const markReviewed = useMarkReviewed(walkthroughId);
  const isReviewed = risk.reviewStatus === 'REVIEWED';

  return (
    <div className={`rounded-xl border ${styles.border} bg-white p-4`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`rounded px-2 py-0.5 text-xs font-bold uppercase tracking-wide ${styles.levelBg} ${styles.levelText}`}>
            {risk.level}
          </span>
          <span className="rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
            {risk.categoryLabel}
          </span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="shrink-0 text-xs text-gray-500 hover:text-gray-700"
          onClick={() => markReviewed.mutate({ riskId: risk.id, reviewed: !isReviewed })}
          disabled={markReviewed.isPending}
        >
          {isReviewed ? '✓ Reviewed' : 'Mark reviewed'}
        </Button>
      </div>

      <h4 className="mt-2 font-semibold text-gray-900">{risk.title}</h4>
      <p className="mt-1 text-sm text-gray-600 leading-relaxed">{risk.description}</p>

      {risk.suggestion && (
        <div className="mt-3 flex gap-2 rounded-lg bg-amber-50 p-3">
          <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
          <p className="text-sm text-amber-800">
            <span className="font-semibold">Suggestion:</span> {risk.suggestion}
          </p>
        </div>
      )}

      <div className="mt-3 flex items-center gap-1.5 text-xs text-gray-400">
        <FileCode className="h-3.5 w-3.5" />
        <span>{risk.filename}</span>
      </div>
    </div>
  );
}
