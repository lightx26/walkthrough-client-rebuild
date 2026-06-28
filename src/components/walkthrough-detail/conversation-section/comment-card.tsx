import { Trash2 } from 'lucide-react';

import { UserAvatar } from '@/components/ui';
import { Button } from '@/components/ui/button';

import type { WalkthroughComment } from '@/types/walkthrough';

import { formatRelativeTime } from '@/utils/date-diff';

interface CommentCardProps {
  comment: WalkthroughComment;
  isAuthor: boolean;
  canDelete: boolean;
  onDelete: () => void;
  deleting: boolean;
}

export function CommentCard({ comment, isAuthor, canDelete, onDelete, deleting }: CommentCardProps) {
  return (
    <div className="group overflow-hidden rounded-lg border border-gray-200">
      <div className="flex items-center gap-2 border-b border-gray-100 bg-gray-50/60 px-4 py-2.5">
        <UserAvatar
          src={comment.avatarUrl}
          displayName={comment.username}
          username={comment.username}
          size="sm"
          className="shrink-0"
        />
        <span className="text-sm font-semibold text-gray-900">{comment.username}</span>
        {isAuthor && (
          <span className="rounded-full border border-violet-200 bg-violet-50 px-1.5 py-0.5 text-[11px] font-medium text-violet-600">
            Author
          </span>
        )}
        <span className="text-xs text-gray-400">commented {formatRelativeTime(comment.createdAt)}</span>
        {canDelete && (
          <Button
            variant="ghost"
            size="none"
            onClick={onDelete}
            disabled={deleting}
            className="ml-auto p-1 text-gray-400 opacity-0 hover:bg-transparent hover:text-red-500 group-hover:opacity-100"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        )}
      </div>
      <p className="wrap-break-word px-4 py-3 text-sm leading-relaxed text-gray-700">
        {comment.content}
      </p>
    </div>
  );
}
