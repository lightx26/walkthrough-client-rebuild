import { cn } from "@/lib/utils";
import type { TemplatePrType } from "@/types/template";

const STYLES: Record<TemplatePrType, string> = {
  FEATURE: "bg-violet-50 text-violet-700 border-violet-200",
  REFACTOR: "bg-blue-50 text-blue-700 border-violet-200",
  HOTFIX: "bg-orange-50 text-orange-700 border-orange-200",
  BUGFIX: "bg-red-50 text-red-700 border-red-200",
  MIGRATION: "bg-emerald-50 text-emerald-700 border-emerald-200",
  OTHER: "bg-gray-50 text-gray-600 border-gray-200",
};

export function PrTypeBadge({ prType }: { prType: TemplatePrType | null }) {
  if (!prType) return null;
  return (
    <span
      className={cn(
        "inline-flex items-center text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded border",
        STYLES[prType],
      )}
    >
      {prType}
    </span>
  );
}

export const PR_TYPE_OPTIONS: { value: TemplatePrType; label: string }[] = [
  { value: "FEATURE", label: "Feature" },
  { value: "REFACTOR", label: "Refactor" },
  { value: "BUGFIX", label: "Bug fix" },
  { value: "HOTFIX", label: "Hotfix" },
  { value: "MIGRATION", label: "Migration" },
  { value: "OTHER", label: "Other" },
];
