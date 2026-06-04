'use client';

import type { RiskLevel, RiskZone } from '@/types/risk';

type FilterLevel = 'ALL' | RiskLevel;

interface RiskFilterTabsProps {
  risks: RiskZone[];
  active: FilterLevel;
  onChange: (level: FilterLevel) => void;
}

const TABS: { key: FilterLevel; label: string }[] = [
  { key: 'ALL',      label: 'All' },
  { key: 'CRITICAL', label: 'Critical' },
  { key: 'HIGH',     label: 'High' },
  { key: 'MEDIUM',   label: 'Medium' },
  { key: 'LOW',      label: 'Low' },
];

export function RiskFilterTabs({ risks, active, onChange }: RiskFilterTabsProps) {
  const count = (key: FilterLevel) =>
    key === 'ALL' ? risks.length : risks.filter((r) => r.level === key).length;

  return (
    <div className="flex gap-1 rounded-lg bg-gray-100 p-1">
      {TABS.map(({ key, label }) => {
        const n = count(key);
        return (
          <button
            key={key}
            onClick={() => onChange(key)}
            className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
              active === key
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {label}
            <span className={`rounded-full px-1.5 py-0.5 text-xs ${
              active === key ? 'bg-gray-100 text-gray-700' : 'bg-transparent text-gray-400'
            }`}>
              {n}
            </span>
          </button>
        );
      })}
    </div>
  );
}

export function filterRisks(risks: RiskZone[], level: FilterLevel): RiskZone[] {
  return level === 'ALL' ? risks : risks.filter((r) => r.level === level);
}
