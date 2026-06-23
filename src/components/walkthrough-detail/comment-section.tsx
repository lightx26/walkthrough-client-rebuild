'use client';

import { useState } from 'react';

import { MessageSquare, Send, Trash2 } from 'lucide-react';

import { UserAvatar } from '@/components/ui';
import { Button } from '@/components/ui/button';

import { useCurrentUser } from '@/hooks/use-auth';
import { useCreateWalkthroughComment, useDeleteComment, useWalkthroughComments } from '@/hooks/use-walkthrough';

import { formatRelativeTime } from '@/utils/date-diff';

interface CommentSectionProps {
  walkthroughId: string;
}

export function CommentSection({ walkthroughId }: CommentSectionProps) {
  const user = useCurrentUser();
  const [content, setContent] = useState('');

  const { data } = useWalkthroughComments(walkthroughId);

  const comments = (data?.data?.items ?? []).filter(
    (c) => !c.chapterId && !c.walkthroughFileId && !c.parentId
  );

  const addComment = useCreateWalkthroughComment(walkthroughId);
  const deleteComment = useDeleteComment(walkthroughId);

  const handleSubmit = () => {
    if (!content.trim()) return;
    addComment.mutate({ content }, { onSuccess: () => setContent('') });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white">
      <div className="flex items-center gap-2 border-b border-gray-100 px-6 py-4">
        <MessageSquare className="h-4 w-4 text-gray-400" />
        <h3 className="font-semibold text-gray-900">General Discussion</h3>
        <span className="text-sm text-gray-400">{comments.length}</span>
      </div>

      {/* Comment input */}
      <div className="flex items-start gap-3 border-b border-gray-100 px-6 py-4">
        <UserAvatar
          src={user?.avatarUrl}
          displayName={user?.displayName}
          username={user?.username}
          size="sm"
          className="mt-0.5 shrink-0"
        />
        <div className="flex min-w-0 flex-1 items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2">
          <textarea
            rows={1}
            className="min-w-0 flex-1 resize-none bg-transparent text-sm text-gray-500 outline-none placeholder:text-gray-300"
            placeholder="Add a comment..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={handleKeyDown}
            maxLength={1000}
          />
          <Button
            variant="primarySoft"
            size="none"
            onClick={handleSubmit}
            disabled={!content.trim() || addComment.isPending}
            className="shrink-0 p-1.5"
          >
            <Send className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      {/* Comments list */}
      {comments.length > 0 && (
        <div className="divide-y divide-gray-100">
          {comments.map((comment) => (
            <div key={comment.id} className="group flex gap-3 px-6 py-3.5">
              <UserAvatar
                src={comment.avatarUrl}
                displayName={comment.username}
                username={comment.username}
                size="sm"
                className="mt-0.5 shrink-0"
              />
              <div className="min-w-0 flex-1">
                <div className="mb-1 flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-900">{comment.username}</span>
                  <span className="text-xs text-gray-400">
                    {formatRelativeTime(comment.createdAt)}
                  </span>
                  {user?.id === comment.userId && (
                    <Button
                      variant="ghost"
                      size="none"
                      onClick={() => deleteComment.mutate(comment.id)}
                      disabled={deleteComment.isPending}
                      className="ml-auto opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:bg-transparent hover:text-red-500"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  )}
                </div>
                <p className="text-sm leading-relaxed wrap-break-word text-gray-700">
                  {comment.content}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
