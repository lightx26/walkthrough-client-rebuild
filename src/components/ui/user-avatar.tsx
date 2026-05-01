"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

type AvatarSize = "sm" | "md" | "lg";

const sizeClasses: Record<AvatarSize, string> = {
  sm: "w-6 h-6 text-[10px]",
  md: "w-8 h-8 text-xs",
  lg: "w-10 h-10 text-sm",
};

interface UserAvatarProps {
  src?: string | null;
  displayName?: string | null;
  username?: string | null;
  size?: AvatarSize;
  className?: string;
}

export function UserAvatar({
  src,
  displayName,
  username,
  size = "md",
  className,
}: UserAvatarProps) {
  const [imgError, setImgError] = useState(false);

  const initials = displayName
    ? displayName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : (username?.[0]?.toUpperCase() ?? "?");

  const showImage = !!src && !imgError;

  return (
    <div
      className={cn(
        "rounded-full shrink-0 overflow-hidden",
        !showImage &&
          "bg-violet-600 flex items-center justify-center text-white font-semibold",
        sizeClasses[size],
        className,
      )}
    >
      {showImage ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={displayName || username || "User avatar"}
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
          onError={() => setImgError(true)}
        />
      ) : (
        initials
      )}
    </div>
  );
}
