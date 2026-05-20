import { cn } from "@/lib/utils";

export function MatrixLegendBadge({
  color,
  icon,
  children,
}: {
  color: "emerald" | "amber";
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span
        className={cn(
          "w-5 h-5 rounded-md border flex items-center justify-center",
          color === "emerald"
            ? "bg-emerald-50 border-emerald-200 text-emerald-600"
            : "bg-amber-50 border-amber-200 text-amber-600",
        )}
      >
        {icon}
      </span>
      {children}
    </span>
  );
}
