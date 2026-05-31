import { useEffect, useRef, useState } from 'react';

import { cn } from '@/lib/utils';
import { Calendar, ChevronDown, ChevronUp, X } from 'lucide-react';

import { Button } from '@/components/ui/button';

export interface SearchDateRange {
  from: string;
  to: string;
}

interface SearchDateRangeDropdownProps {
  range: SearchDateRange;
  onChange: (r: SearchDateRange) => void;
  onClear: () => void;
}

export function SearchDateRangeDropdown({
  range,
  onChange,
  onClear,
}: SearchDateRangeDropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const isActive = !!(range.from || range.to);

  function applyQuickSelect(days: number) {
    const to = new Date();
    const from = new Date();
    from.setDate(from.getDate() - days);
    onChange({
      from: from.toISOString().split('T')[0],
      to: to.toISOString().split('T')[0],
    });
    setOpen(false);
  }

  return (
    <div ref={ref} className="relative">
      <Button
        variant="outline"
        size="none"
        onClick={() => setOpen((v) => !v)}
        className={cn(
          'gap-1 px-2.5 py-1 text-xs font-normal',
          isActive
            ? 'border-indigo-300 bg-indigo-50 text-indigo-700 hover:bg-indigo-50'
            : 'text-gray-500 hover:bg-gray-100'
        )}
      >
        <Calendar className="h-3 w-3" />
        {isActive ? (
          <span>
            {range.from || '...'} to {range.to || '...'}
          </span>
        ) : (
          'Date range'
        )}
        {open ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
        {isActive && (
          <span
            role="button"
            onClick={(e) => {
              e.stopPropagation();
              onClear();
            }}
            className="ml-0.5 text-indigo-500 hover:text-indigo-700"
          >
            <X className="h-3 w-3" />
          </span>
        )}
      </Button>

      {open && (
        <div className="absolute top-full left-0 z-60 mt-1 w-72 rounded-xl border border-gray-100 bg-white p-4 shadow-lg">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="mb-1.5 text-[10px] font-semibold tracking-wider text-gray-400 uppercase">
                From
              </p>
              <input
                type="date"
                value={range.from}
                onChange={(e) => onChange({ ...range, from: e.target.value })}
                className="w-full rounded-lg border border-gray-200 px-2.5 py-1.5 text-xs text-gray-700 outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-200"
              />
            </div>
            <div>
              <p className="mb-1.5 text-[10px] font-semibold tracking-wider text-gray-400 uppercase">
                To
              </p>
              <input
                type="date"
                value={range.to}
                onChange={(e) => onChange({ ...range, to: e.target.value })}
                className="w-full rounded-lg border border-gray-200 px-2.5 py-1.5 text-xs text-gray-700 outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-200"
              />
            </div>
          </div>

          <div className="mt-3">
            <p className="mb-1.5 text-[10px] font-semibold tracking-wider text-gray-400 uppercase">
              Quick select
            </p>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                size="none"
                onClick={() => applyQuickSelect(7)}
                className="px-3 py-1.5 text-xs font-normal text-gray-600"
              >
                Last 7 days
              </Button>
              <Button
                variant="outline"
                size="none"
                onClick={() => applyQuickSelect(30)}
                className="px-3 py-1.5 text-xs font-normal text-gray-600"
              >
                Last 30 days
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
