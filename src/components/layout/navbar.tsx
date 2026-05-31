'use client';

import { useEffect, useState } from 'react';

import Link from 'next/link';

import { Bell, LogOut, Search } from 'lucide-react';

import { SearchModal } from '@/components/search';
import { UserAvatar } from '@/components/ui';
import { Button } from '@/components/ui/button';

import { useCurrentUser, useLogout } from '@/hooks/use-auth';

export function Navbar() {
  const user = useCurrentUser();
  const logout = useLogout();
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen((open) => !open);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <>
      <header className="flex shrink-0 items-center gap-3 border-b border-gray-200 bg-white px-6 py-3">
        {/* Search trigger */}
        <Button
          variant="outline"
          size="none"
          onClick={() => setSearchOpen(true)}
          className="bg-muted text-muted-foreground w-72 justify-start gap-2 px-3 py-1.5 font-normal"
        >
          <Search className="h-4 w-4 shrink-0" />
          <span className="flex-1 truncate text-left text-xs">
            Search walkthroughs, PRs, files...
          </span>
          <span className="flex shrink-0 items-center gap-0.5">
            <kbd className="bg-border text-muted-foreground rounded px-1 py-0.5 font-sans text-[10px]">
              ⌘
            </kbd>
            <kbd className="bg-border text-muted-foreground rounded px-1 py-0.5 font-sans text-[10px]">
              K
            </kbd>
          </span>
        </Button>

        <div className="flex-1" />

        {/* Notification bell with badge */}
        <Button variant="ghost" size="iconSm" className="relative">
          <Bell className="text-muted-foreground h-5 w-5" />
          <span className="bg-destructive absolute top-1.5 right-1.5 h-2 w-2 rounded-full" />
        </Button>

        {/* User avatar and info */}
        <Link
          href={user ? `/profile/${user.username}` : '#'}
          className="flex items-center gap-2.5 rounded-md p-2 transition-colors hover:bg-gray-100"
        >
          <UserAvatar
            src={user?.avatarUrl}
            displayName={user?.displayName}
            username={user?.username}
          />
          <div className="text-sm leading-tight">
            <p className="font-semibold text-gray-900">{user?.displayName || user?.username}</p>
            <p className="text-xs text-gray-400">@{user?.username}</p>
          </div>
        </Link>

        {/* Sign out button */}
        <Button
          variant="destructiveGhost"
          size="iconSm"
          onClick={() => logout.mutate()}
          title="Sign out"
        >
          <LogOut className="h-4 w-4" />
        </Button>
      </header>

      {searchOpen && <SearchModal onClose={() => setSearchOpen(false)} />}
    </>
  );
}
