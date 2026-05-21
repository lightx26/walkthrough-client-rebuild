import { useEffect, useRef, useState } from "react";
import { Search, User, ChevronDown, ChevronUp, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useUserSearch } from "@/hooks/use-search";
import { UserAvatar } from "@/components/ui";
import type { UserSearchResult } from "@/types/search";

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
  const [authorQuery, setAuthorQuery] = useState("");
  const ref = useRef<HTMLDivElement>(null);
  const { data } = useUserSearch(authorQuery);
  const users = data?.data?.items ?? [];

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const isActive = selectedAuthor !== null;

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "flex items-center gap-1 px-2.5 py-1 rounded-md text-xs transition-colors border",
          isActive
            ? "bg-indigo-50 border-indigo-300 text-indigo-700"
            : "text-gray-500 hover:bg-gray-100 border-gray-200",
        )}
      >
        <User className="w-3 h-3" />
        {selectedAuthor ? (
          <span className="max-w-20 truncate">
            {selectedAuthor.displayName ?? selectedAuthor.username}
          </span>
        ) : (
          "Author"
        )}
        {open ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
        {isActive && (
          <span
            role="button"
            onClick={(e) => {
              e.stopPropagation();
              onClear();
            }}
            className="ml-0.5 text-indigo-500 hover:text-indigo-700"
          >
            <X className="w-3 h-3" />
          </span>
        )}
      </button>

      {open && (
        <div className="absolute top-full mt-1 left-0 z-60 w-64 bg-white rounded-xl shadow-lg border border-gray-100 py-1.5 overflow-hidden">
          <div className="flex items-center gap-2 px-3 py-1.5 border-b border-gray-100">
            <Search className="w-3.5 h-3.5 text-gray-400 shrink-0" />
            <input
              autoFocus
              value={authorQuery}
              onChange={(e) => setAuthorQuery(e.target.value)}
              placeholder="Search author..."
              className="flex-1 text-xs text-gray-900 placeholder:text-gray-400 outline-none"
            />
            {authorQuery && (
              <button onClick={() => setAuthorQuery("")}>
                <X className="w-3 h-3 text-gray-400 hover:text-gray-600" />
              </button>
            )}
          </div>

          {users.length > 0 ? (
            <div className="py-1 max-h-48 overflow-y-auto">
              {users.map((user) => (
                <button
                  key={user.id}
                  onClick={() => {
                    onSelect(user);
                    setOpen(false);
                    setAuthorQuery("");
                  }}
                  className={cn(
                    "w-full flex items-center gap-2.5 px-3 py-2 hover:bg-gray-50 transition-colors",
                    selectedAuthor?.id === user.id && "bg-indigo-50",
                  )}
                >
                  <UserAvatar
                    src={user.avatarUrl ?? undefined}
                    username={user.username}
                    displayName={user.displayName ?? undefined}
                    size="sm"
                  />
                  <span className="text-sm text-gray-800 truncate">
                    {user.displayName ?? user.username}
                  </span>
                </button>
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
