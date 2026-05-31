import { useEffect, useRef, useState } from 'react';

import { cn } from '@/lib/utils';
import type { UserSearchResult } from '@/types/search';
import { ChevronDown, ChevronUp, Search, User, X } from 'lucide-react';

import { UserAvatar } from '@/components/ui';
import { Button } from '@/components/ui/button';

import { useUserSearch } from '@/hooks/use-search';

interface SearchAuthorDropdownProps {
  selectedAuthor: UserSearchResult | null;
  onSelect: (user: UserSearchResult) => void;
  onClear: () => void;
}

export function SearchAuthorDropdown({
  selectedAuthor,
  onSelect,
  onClear,
}: SearchAuthorDropdownProps) {
  const [open, setOpen] = useState(false);
  const [authorQuery, setAuthorQuery] = useState('');
  const ref = useRef<HTMLDivElement>(null);
  const { data } = useUserSearch(authorQuery);
  const users = data?.data?.items ?? [];

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const isActive = selectedAuthor !== null;

  return (
    <div ref={ref} className="relative">
      <Button
        variant="outline"
        size="none"
        onClick={() => setOpen((v) => !v)}
        className={cn(
          'gap-1 px-2.5 py-1 text-xs font-normal',
          isActive
            ? 'border-indigo-300 bg-indigo-50 text-indigo-700 hover:bg-indigo-50'
            : 'text-gray-500 hover:bg-gray-100'
        )}
      >
        <User className="h-3 w-3" />
        {selectedAuthor ? (
          <span className="max-w-20 truncate">
            {selectedAuthor.displayName ?? selectedAuthor.username}
          </span>
        ) : (
          'Author'
        )}
        {open ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
        {isActive && (
          <span
            role="button"
            onClick={(e) => {
              e.stopPropagation();
              onClear();
            }}
            className="ml-0.5 text-indigo-500 hover:text-indigo-700"
          >
            <X className="h-3 w-3" />
          </span>
        )}
      </Button>

      {open && (
        <div className="absolute top-full left-0 z-60 mt-1 w-64 overflow-hidden rounded-xl border border-gray-100 bg-white py-1.5 shadow-lg">
          <div className="flex items-center gap-2 border-b border-gray-100 px-3 py-1.5">
            <Search className="h-3.5 w-3.5 shrink-0 text-gray-400" />
            <input
              autoFocus
              value={authorQuery}
              onChange={(e) => setAuthorQuery(e.target.value)}
              placeholder="Search author..."
              className="flex-1 text-xs text-gray-900 outline-none placeholder:text-gray-400"
            />
            {authorQuery && (
              <Button
                variant="ghost"
                size="none"
                onClick={() => setAuthorQuery('')}
                className="p-0 hover:bg-transparent"
              >
                <X className="h-3 w-3 text-gray-400 hover:text-gray-600" />
              </Button>
            )}
          </div>

          {users.length > 0 ? (
            <div className="max-h-48 overflow-y-auto py-1">
              {users.map((user) => (
                <Button
                  key={user.id}
                  variant="ghost"
                  size="none"
                  onClick={() => {
                    onSelect(user);
                    setOpen(false);
                    setAuthorQuery('');
                  }}
                  className={cn(
                    'w-full justify-start gap-2.5 rounded-none px-3 py-2 font-normal hover:bg-gray-50',
                    selectedAuthor?.id === user.id && 'bg-indigo-50 hover:bg-indigo-50'
                  )}
                >
                  <UserAvatar
                    src={user.avatarUrl ?? undefined}
                    username={user.username}
                    displayName={user.displayName ?? undefined}
                    size="sm"
                  />
                  <span className="truncate text-sm text-gray-800">
                    {user.displayName ?? user.username}
                  </span>
                </Button>
              ))}
            </div>
          ) : authorQuery.trim() ? (
            <p className="px-3 py-3 text-xs text-gray-400">No users found</p>
          ) : (
            <p className="px-3 py-3 text-xs text-gray-400">Type to search users</p>
          )}
        </div>
      )}
    </div>
  );
}
