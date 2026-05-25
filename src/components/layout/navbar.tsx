"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Bell, LogOut, Search } from "lucide-react";
import { useCurrentUser, useLogout } from "@/hooks/use-auth";
import { UserAvatar } from "@/components/ui";
import { Button } from "@/components/ui/button";
import { SearchModal } from "@/components/search";

export function Navbar() {
  const user = useCurrentUser();
  const logout = useLogout();
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen((open) => !open);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <header className="flex items-center gap-3 px-6 py-3 border-b border-gray-200 bg-white shrink-0">
        {/* Search trigger */}
        <Button
          variant="outline"
          size="none"
          onClick={() => setSearchOpen(true)}
          className="justify-start gap-2 px-3 py-1.5 bg-muted text-muted-foreground font-normal w-72"
        >
          <Search className="w-4 h-4 shrink-0" />
          <span className="flex-1 text-left text-xs truncate">
            Search walkthroughs, PRs, files...
          </span>
          <span className="flex items-center gap-0.5 shrink-0">
            <kbd className="text-[10px] bg-border text-muted-foreground px-1 py-0.5 rounded font-sans">
              ⌘
            </kbd>
            <kbd className="text-[10px] bg-border text-muted-foreground px-1 py-0.5 rounded font-sans">
              K
            </kbd>
          </span>
        </Button>

        <div className="flex-1" />

        {/* Notification bell with badge */}
        <Button variant="ghost" size="iconSm" className="relative">
          <Bell className="w-5 h-5 text-muted-foreground" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-destructive rounded-full" />
        </Button>

        {/* User avatar and info */}
        <Link
          href={user ? `/profile/${user.username}` : "#"}
          className="flex items-center gap-2.5 p-2 rounded-md hover:bg-gray-100 transition-colors"
        >
          <UserAvatar
            src={user?.avatarUrl}
            displayName={user?.displayName}
            username={user?.username}
          />
          <div className="text-sm leading-tight">
            <p className="font-semibold text-gray-900">
              {user?.displayName || user?.username}
            </p>
            <p className="text-gray-400 text-xs">@{user?.username}</p>
          </div>
        </Link>

        {/* Sign out button */}
        <Button
          variant="destructiveGhost"
          size="iconSm"
          onClick={() => logout.mutate()}
          title="Sign out"
        >
          <LogOut className="w-4 h-4" />
        </Button>
      </header>

      {searchOpen && <SearchModal onClose={() => setSearchOpen(false)} />}
    </>
  );
}
