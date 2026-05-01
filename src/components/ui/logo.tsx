import { GitBranch } from "lucide-react";
import { cn } from "@/lib/utils";

type LogoSize = "sm" | "md" | "lg";

const sizeConfig: Record<LogoSize, { container: string; icon: string }> = {
  sm: { container: "w-7 h-7 rounded-lg", icon: "w-4 h-4" },
  md: {
    container: "w-14 h-14 rounded-2xl shadow-md shadow-violet-200",
    icon: "w-7 h-7",
  },
  lg: {
    container: "w-16 h-16 rounded-2xl shadow-md shadow-violet-200",
    icon: "w-8 h-8",
  },
};

interface LogoProps {
  size?: LogoSize;
  className?: string;
}

export function Logo({ size = "md", className }: LogoProps) {
  const { container, icon } = sizeConfig[size];

  return (
    <div
      className={cn(
        "bg-violet-600 flex items-center justify-center",
        container,
        className,
      )}
    >
      <GitBranch className={cn("text-white", icon)} strokeWidth={2} />
    </div>
  );
}
