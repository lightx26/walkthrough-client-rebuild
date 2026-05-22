import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

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
    <Button
      variant={active ? "primarySoft" : "ghost"}
      size="none"
      onClick={onClick}
      className={cn(
        "gap-1.5 text-xs font-medium px-3 py-1.5",
        active
          ? "border border-primary-soft"
          : "text-gray-600 hover:text-gray-900",
      )}
    >
      {icon}
      {label}
    </Button>
  );
}
