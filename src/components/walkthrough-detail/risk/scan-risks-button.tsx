'use client';

import { useTriggerScan, useRiskScan } from '@/hooks/use-risk';
import { Loader2, ShieldAlert, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ScanRisksButtonProps {
  walkthroughId: string;
}

export function ScanRisksButton({ walkthroughId }: ScanRisksButtonProps) {
  const { data: scan } = useRiskScan(walkthroughId);
  const trigger = useTriggerScan(walkthroughId);

  const isScanning = scan?.status === 'PENDING' || scan?.status === 'ANALYZING';
  const hasResults = scan?.status === 'COMPLETED';
  const totalRisks = hasResults
    ? (scan.counts.critical + scan.counts.high + scan.counts.medium + scan.counts.low)
    : 0;
  const hasCritical = hasResults && scan.counts.critical > 0;

  if (isScanning) {
    return (
      <Button variant="outline" disabled className="gap-2 text-purple-600 border-purple-200">
        <Loader2 className="h-4 w-4 animate-spin" />
        Analyzing...
      </Button>
    );
  }

  if (hasResults && totalRisks > 0) {
    return (
      <Button
        variant="outline"
        onClick={() => trigger.mutate()}
        className={`gap-2 ${hasCritical ? 'border-red-200 text-red-600 hover:bg-red-50' : 'border-orange-200 text-orange-600 hover:bg-orange-50'}`}
      >
        <ShieldAlert className="h-4 w-4" />
        {totalRisks} {totalRisks === 1 ? 'risk' : 'risks'}
        {hasCritical && <span className="text-xs font-semibold">· {scan.counts.critical} critical</span>}
      </Button>
    );
  }

  return (
    <Button
      variant="outline"
      onClick={() => trigger.mutate()}
      disabled={trigger.isPending}
      className="gap-2"
    >
      <Zap className="h-4 w-4" />
      Scan Risks
    </Button>
  );
}
