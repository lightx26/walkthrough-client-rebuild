"use client";

import { Bell, LogOut, Search } from "lucide-react";
import { useCurrentUser, useLogout } from "@/hooks/use-auth";

export function Navbar() {
  const user = useCurrentUser();
  const logout = useLogout();

  const initials = user?.displayName
    ? user.displayName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "QN";

  return (
    <header className="flex items-center gap-3 px-6 py-3 border-b border-gray-200 bg-white shrink-0">
      <button className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-gray-50 border border-gray-200 text-sm text-gray-400 hover:bg-gray-100 transition-colors w-72">
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

      <button className="relative p-2 rounded-md hover:bg-gray-100 transition-colors">
        <Bell className="w-5 h-5 text-gray-500" />
        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
      </button>
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-full bg-violet-600 flex items-center justify-center text-white text-xs font-semibold shrink-0">
          {initials}
        </div>
        <div className="text-sm leading-tight">
          <p className="font-semibold text-gray-900">
            {user?.displayName ?? "Quang Nguyen"}
          </p>
          <p className="text-gray-400 text-xs">@{user?.username}</p>
        </div>
      </div>
      <button
        onClick={() => logout.mutate()}
        className="p-2 rounded-md text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500"
        title="Sign out"
      >
        <LogOut className="w-4 h-4" />
      </button>
    </header>
  );
}
