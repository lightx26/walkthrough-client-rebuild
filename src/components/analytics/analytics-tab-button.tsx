import { cn } from "@/lib/utils";

export function AnalyticsTabButton({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-md transition-colors",
        active
          ? "bg-violet-50 text-violet-700 border border-violet-200"
          : "text-gray-600 hover:text-gray-900",
      )}
    >
      {icon}
      {label}
    </button>
  );
}
