"use client";

import { useEffect, useState } from "react";
import { Bell, LogOut, Search } from "lucide-react";
import { useCurrentUser, useLogout } from "@/hooks/use-auth";
import { UserAvatar } from "@/components/ui/user-avatar";
import { SearchModal } from "@/components/search/search-modal";

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
        <button
          onClick={() => setSearchOpen(true)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-gray-50 border border-gray-200 text-sm text-gray-400 hover:bg-gray-100 transition-colors w-72"
        >
          <Search className="w-4 h-4 shrink-0" />
          <span className="flex-1 text-left text-xs truncate">
            Search walkthroughs, PRs, files...
          </span>
          <span className="flex items-center gap-0.5 shrink-0">
            <kbd className="text-[10px] bg-gray-200 text-gray-500 px-1 py-0.5 rounded font-sans">
              ⌘
            </kbd>
            <kbd className="text-[10px] bg-gray-200 text-gray-500 px-1 py-0.5 rounded font-sans">
              K
            </kbd>
          </span>
        </button>

        <div className="flex-1" />

        {/* Notification bell with badge */}
        <button className="relative p-2 rounded-md hover:bg-gray-100 transition-colors cursor-pointer">
          <Bell className="w-5 h-5 text-gray-500" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
        </button>

        {/* User avatar and info */}
        <div className="flex items-center gap-2.5 p-2 rounded-md hover:bg-gray-100 transition-colors cursor-pointer">
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
        </div>

        {/* Sign out button */}
        <button
          onClick={() => logout.mutate()}
          className="p-2 rounded-md text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500 cursor-pointer"
          title="Sign out"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </header>

      {searchOpen && <SearchModal onClose={() => setSearchOpen(false)} />}
    </>
  );
}
