'use client';

import { Loader2, ShieldAlert, Sparkles, Zap } from 'lucide-react';

import { Button } from '@/components/ui/button';

import { useRiskScan, useTriggerScan } from '@/hooks/use-risk';

interface ScanRisksButtonProps {
  walkthroughId: string;
}

export function ScanRisksButton({ walkthroughId }: ScanRisksButtonProps) {
  const { data: scan } = useRiskScan(walkthroughId);
  const trigger = useTriggerScan(walkthroughId);

  const isScanning = scan?.status === 'PENDING' || scan?.status === 'ANALYZING';
  const hasResults = scan?.status === 'COMPLETED';
  const totalRisks = hasResults
    ? scan.counts.critical + scan.counts.high + scan.counts.medium + scan.counts.low
    : 0;
  const hasCritical = hasResults && scan.counts.critical > 0;

  if (isScanning) {
    return (
      <Button variant="outline" disabled className="gap-2 border-purple-200 text-purple-600">
        <Loader2 className="h-4 w-4 animate-spin" />
        Analyzing...
      </Button>
    );
  }

  if (hasResults && totalRisks > 0) {
    return (
      <Button
        variant="outline"
        size="sm"
        className={`gap-1.5 rounded-xl ${hasCritical ? 'border-red-200 text-red-600 hover:bg-red-50' : 'border-orange-200 text-orange-600 hover:bg-orange-50'}`}
      >
        <ShieldAlert className="size-3.5" />
        {totalRisks} {totalRisks === 1 ? 'risk' : 'risks'}
        {hasCritical && (
          <span className="text-xs font-semibold">· {scan.counts.critical} critical</span>
        )}
      </Button>
    );
  }

  return (
    <Button
      variant="outline"
      onClick={() => trigger.mutate()}
      disabled={trigger.isPending}
      className="gap-1.5 rounded-xl"
    >
      <Sparkles className="size-3.5" />
      Scan Risks
    </Button>
  );
}
