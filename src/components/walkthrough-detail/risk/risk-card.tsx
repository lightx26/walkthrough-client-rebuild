'use client';

import React, { useState } from 'react';

import type { RiskLevel, RiskZone } from '@/types/risk';
import { ChevronDown, ChevronUp, FileCode, Lightbulb } from 'lucide-react';

import { Button } from '@/components/ui/button';

import { useMarkReviewed } from '@/hooks/use-risk';

const LEVEL_STYLES: Record<RiskLevel, { border: string; levelBg: string; levelText: string }> = {
  CRITICAL: { border: 'border-red-200', levelBg: 'bg-red-100', levelText: 'text-red-700' },
  HIGH: { border: 'border-orange-200', levelBg: 'bg-orange-100', levelText: 'text-orange-700' },
  MEDIUM: { border: 'border-amber-200', levelBg: 'bg-amber-100', levelText: 'text-amber-700' },
  LOW: { border: 'border-blue-200', levelBg: 'bg-blue-100', levelText: 'text-blue-700' },
};

interface RiskCardProps {
  risk: RiskZone;
  walkthroughId: string;
  onFileClick?: (walkthroughFileId: string) => void;
}

export function RiskCard({ risk, walkthroughId, onFileClick }: RiskCardProps) {
  const [expanded, setExpanded] = useState(false);
  const styles = LEVEL_STYLES[risk.level];
  const markReviewed = useMarkReviewed(walkthroughId);
  const isReviewed = risk.reviewStatus === 'REVIEWED';

  const handleMarkReviewed = (e: React.MouseEvent): void => {
    e.stopPropagation();
    markReviewed.mutate({ riskId: risk.id, reviewed: !isReviewed });
  };

  const toggleExpanded = () => setExpanded((v) => !v);

  return (
    <div className={`rounded-xl border ${styles.border} bg-white`}>
      {/* Header — Replaced <Button> with a semantic div to fix HTML nesting rules */}
      <div
        role="button"
        tabIndex={0}
        className="focus-visible:ring-ring flex w-full cursor-pointer items-center gap-3 rounded-t-xl px-4 py-3 text-left transition-colors hover:bg-gray-50 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
        onClick={toggleExpanded}
        onKeyDown={(e) => {
          // Ensure keyboard accessibility matches native button behavior
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggleExpanded();
          }
        }}
      >
        <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2">
          <span
            className={`shrink-0 rounded px-2 py-0.5 text-xs font-bold tracking-wide uppercase ${styles.levelBg} ${styles.levelText}`}
          >
            {risk.level}
          </span>
          <span className="shrink-0 rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
            {risk.categoryLabel}
          </span>
          <span className="min-w-0 truncate text-sm font-semibold text-gray-900">{risk.title}</span>
        </div>

        {/* Inner action button is now legally nested within a <div> */}
        <Button
          variant="ghost"
          size="sm"
          className="z-10 shrink-0 text-xs text-gray-500 hover:text-gray-700"
          onClick={handleMarkReviewed}
          disabled={markReviewed.isPending}
        >
          {isReviewed ? '✓ Reviewed' : 'Mark reviewed'}
        </Button>

        {expanded ? (
          <ChevronUp className="h-4 w-4 shrink-0 text-gray-400" />
        ) : (
          <ChevronDown className="h-4 w-4 shrink-0 text-gray-400" />
        )}
      </div>

      {/* Body — collapsible */}
      <div
        className={`grid transition-all duration-200 ease-in-out ${expanded ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
      >
        <div className="overflow-hidden">
          <div className="border-t border-gray-100 px-4 pt-3 pb-4">
            <p className="mt-1 text-sm leading-relaxed text-gray-600">{risk.description}</p>

            {risk.suggestion && (
              <div className="mt-3 flex gap-2 rounded-lg bg-amber-50 p-3">
                <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
                <p className="text-sm text-amber-800">
                  <span className="font-semibold">Suggestion:</span> {risk.suggestion}
                </p>
              </div>
            )}

            <div className="mt-3 flex items-center gap-1.5 text-xs text-gray-400">
              <FileCode className="h-3.5 w-3.5 shrink-0" />
              {onFileClick ? (
                <button
                  type="button"
                  onClick={() => onFileClick(risk.walkthroughFileId)}
                  className="cursor-pointer truncate font-mono transition-colors hover:text-violet-600 hover:underline"
                  title={`Go to ${risk.filename}`}
                >
                  {risk.filename}
                </button>
              ) : (
                <span className="truncate font-mono">{risk.filename}</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
