"use client";

import { cn } from "@/lib/utils";
import { UserAvatar } from "@/components/ui";

interface Person {
  userId: string;
  username: string;
  displayName: string | null;
  avatarUrl: string | null;
}

const ringStyles = ["ring-2 ring-white"];

export function ReviewerAvatars({
  reviewers,
  max = 5,
  size = "md",
}: {
  reviewers: Person[];
  max?: number;
  size?: "sm" | "md";
}) {
  const visible = reviewers.slice(0, max);
  const overflow = reviewers.length - visible.length;
  return (
    <div className="flex -space-x-2">
      {visible.map((r) => (
        <UserAvatar
          key={r.userId}
          src={r.avatarUrl}
          username={r.username}
          displayName={r.displayName}
          size={size}
          className={cn(ringStyles[0])}
        />
      ))}
      {overflow > 0 && (
        <span
          className={cn(
            "rounded-full bg-gray-100 text-gray-600 text-[10px] flex items-center justify-center font-semibold",
            size === "sm" ? "w-6 h-6" : "w-8 h-8",
            ringStyles[0],
          )}
        >
          +{overflow}
        </span>
      )}
    </div>
  );
}
