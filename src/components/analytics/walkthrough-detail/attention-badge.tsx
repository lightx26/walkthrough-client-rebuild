import { cn } from "@/lib/utils";

export function AttentionBadge({
  color,
  icon,
  children,
}: {
  color: "emerald" | "amber" | "violet" | "gray" | "orange";
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full border",
        color === "emerald" &&
          "text-emerald-700 bg-emerald-50 border-emerald-200",
        color === "amber" && "text-amber-700 bg-amber-50 border-amber-200",
        color === "violet" && "text-violet-700 bg-violet-50 border-violet-200",
        color === "gray" && "text-gray-700 bg-gray-50 border-gray-200",
        color === "orange" && "text-orange-700 bg-orange-50 border-orange-200",
      )}
    >
      {icon}
      {children}
    </span>
  );
}
