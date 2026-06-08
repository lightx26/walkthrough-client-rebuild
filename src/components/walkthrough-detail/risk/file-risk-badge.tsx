'use client';

import { ShieldAlert } from 'lucide-react';
import type { RiskZone } from '@/types/risk';

interface FileRiskBadgeProps {
  risks: RiskZone[];
  onClick?: () => void;
}

export function FileRiskBadge({ risks, onClick }: FileRiskBadgeProps) {
  if (!risks.length) return null;

  const hasCritical = risks.some((r) => r.level === 'CRITICAL');
  const hasHigh = risks.some((r) => r.level === 'HIGH');

  const colorClass = hasCritical
    ? 'bg-red-100 text-red-700 hover:bg-red-200'
    : hasHigh
      ? 'bg-orange-100 text-orange-700 hover:bg-orange-200'
      : 'bg-amber-100 text-amber-700 hover:bg-amber-200';

  return (
    <span
      className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium transition-colors ${colorClass} ${onClick ? 'cursor-pointer' : ''}`}
      onClick={onClick ? (e) => { e.stopPropagation(); onClick(); } : undefined}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => { if (e.key === 'Enter' || e.key === ' ') { e.stopPropagation(); onClick(); } } : undefined}
    >
      <ShieldAlert className="h-3 w-3" />
      {risks.length} {risks.length === 1 ? 'risk' : 'risks'}
    </span>
  );
}
