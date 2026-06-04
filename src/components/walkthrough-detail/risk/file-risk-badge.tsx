'use client';

import { ShieldAlert } from 'lucide-react';
import type { RiskZone } from '@/types/risk';

interface FileRiskBadgeProps {
  risks: RiskZone[];
}

export function FileRiskBadge({ risks }: FileRiskBadgeProps) {
  if (!risks.length) return null;

  const hasCritical = risks.some((r) => r.level === 'CRITICAL');
  const hasHigh = risks.some((r) => r.level === 'HIGH');

  const colorClass = hasCritical
    ? 'bg-red-100 text-red-700'
    : hasHigh
      ? 'bg-orange-100 text-orange-700'
      : 'bg-amber-100 text-amber-700';

  return (
    <span className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${colorClass}`}>
      <ShieldAlert className="h-3 w-3" />
      {risks.length} {risks.length === 1 ? 'risk' : 'risks'}
    </span>
  );
}
