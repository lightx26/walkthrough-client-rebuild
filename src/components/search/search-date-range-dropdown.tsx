import { useEffect, useRef, useState } from "react";
import { Calendar, ChevronDown, ChevronUp, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

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
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const isActive = !!(range.from || range.to);

  function applyQuickSelect(days: number) {
    const to = new Date();
    const from = new Date();
    from.setDate(from.getDate() - days);
    onChange({
      from: from.toISOString().split("T")[0],
      to: to.toISOString().split("T")[0],
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
          "gap-1 px-2.5 py-1 text-xs font-normal",
          isActive
            ? "bg-indigo-50 border-indigo-300 text-indigo-700 hover:bg-indigo-50"
            : "text-gray-500 hover:bg-gray-100",
        )}
      >
        <Calendar className="w-3 h-3" />
        {isActive ? (
          <span>
            {range.from || "..."} to {range.to || "..."}
          </span>
        ) : (
          "Date range"
        )}
        {open ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
        {isActive && (
          <span
            role="button"
            onClick={(e) => {
              e.stopPropagation();
              onClear();
            }}
            className="ml-0.5 text-indigo-500 hover:text-indigo-700"
          >
            <X className="w-3 h-3" />
          </span>
        )}
      </Button>

      {open && (
        <div className="absolute top-full mt-1 left-0 z-60 w-72 bg-white rounded-xl shadow-lg border border-gray-100 p-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
                From
              </p>
              <input
                type="date"
                value={range.from}
                onChange={(e) => onChange({ ...range, from: e.target.value })}
                className="w-full text-xs text-gray-700 border border-gray-200 rounded-lg px-2.5 py-1.5 outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-200"
              />
            </div>
            <div>
              <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
                To
              </p>
              <input
                type="date"
                value={range.to}
                onChange={(e) => onChange({ ...range, to: e.target.value })}
                className="w-full text-xs text-gray-700 border border-gray-200 rounded-lg px-2.5 py-1.5 outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-200"
              />
            </div>
          </div>

          <div className="mt-3">
            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
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
