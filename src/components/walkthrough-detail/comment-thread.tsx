'use client';

import React, { useState } from 'react';

import type { WalkthroughComment } from '@/types/walkthrough';
import { CornerDownLeft, Send } from 'lucide-react';

import { UserAvatar } from '@/components/ui';
import { Button } from '@/components/ui/button';

import { useCurrentUser } from '@/hooks/use-auth';
import { useCreateFileComment } from '@/hooks/use-walkthrough';

import { formatRelativeTime } from '@/utils/date-diff';

import { SyncStatusIcon } from './sync-status-icon';

interface CommentThreadProps {
  comments: WalkthroughComment[];
  walkthroughId: string;
  fileId: string;
  diffPosition: number;
}

export function CommentThread({
  comments,
  walkthroughId,
  fileId,
  diffPosition,
}: CommentThreadProps) {
  const user = useCurrentUser();
  const [replyTargetId, setReplyTargetId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');

  const addReply = useCreateFileComment(walkthroughId, fileId);

  return (
    <>
      {comments.map((c) => (
        <React.Fragment key={c.id}>
          <tr>
            <td colSpan={3} className="px-0 py-0">
              <div className="min-w-0 border-l-4 border-violet-400 bg-white px-4 py-3">
                <div className="mb-1 flex items-center gap-2">
                  <UserAvatar
                    src={c.avatarUrl}
                    displayName={c.username}
                    username={c.username}
                    size="sm"
                  />
                  <span className="text-[10px] font-semibold text-gray-900">{c.username}</span>
                  <span className="text-[10px] text-gray-400">
                    {formatRelativeTime(c.createdAt)}
                  </span>
                  <SyncStatusIcon status={c.syncStatus} />
                </div>
                <p className="ml-8 text-xs leading-relaxed wrap-break-word whitespace-pre-wrap text-gray-700">
                  {c.content}
                </p>
                <Button
                  variant="ghost"
                  size="none"
                  onClick={() => setReplyTargetId(replyTargetId === c.id ? null : c.id)}
                  className="mt-1 ml-8 gap-1 px-0 py-0 text-xs font-normal text-gray-400 hover:bg-transparent hover:text-violet-600"
                >
                  <CornerDownLeft className="h-3 w-3" />
                  Reply
                </Button>
                {/* Replies */}
                {c.replies.length > 0 && (
                  <div className="mt-2 ml-8 space-y-2 border-l border-gray-200 pl-3">
                    {c.replies.map((r) => (
                      <div key={r.id}>
                        <div className="mb-0.5 flex items-center gap-2">
                          <UserAvatar
                            src={r.avatarUrl}
                            displayName={r.username}
                            username={r.username}
                            size="sm"
                          />
                          <span className="text-[10px] font-semibold text-gray-900">
                            {r.username}
                          </span>
                          <span className="text-[10px] text-gray-400">
                            {formatRelativeTime(r.createdAt)}
                          </span>
                        </div>
                        <p className="ml-8 text-xs leading-relaxed wrap-break-word whitespace-pre-wrap text-gray-700">
                          {r.content}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </td>
          </tr>
          {/* Reply input */}
          {replyTargetId === c.id && (
            <tr>
              <td colSpan={3} className="px-0 py-0">
                <div className="flex items-center gap-2 border-l-4 border-violet-200 bg-violet-50 px-4 py-2.5">
                  <UserAvatar
                    src={user?.avatarUrl}
                    displayName={user?.displayName}
                    username={user?.username}
                    size="sm"
                    className="shrink-0"
                  />
                  <input
                    autoFocus
                    className="min-w-0 flex-1 rounded-md border border-gray-200 bg-white px-2.5 py-1.5 text-sm text-gray-900 outline-none placeholder:text-gray-500 focus:border-violet-400"
                    placeholder="Write a reply..."
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    maxLength={1000}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey && replyText.trim()) {
                        e.preventDefault();
                        addReply.mutate(
                          {
                            content: replyText,
                            walkthroughFileId: fileId,
                            diffPosition,
                            parentId: c.id,
                          },
                          {
                            onSuccess: () => {
                              setReplyText('');
                              setReplyTargetId(null);
                            },
                          }
                        );
                      }
                    }}
                  />
                  <Button
                    variant="primarySoft"
                    size="none"
                    onClick={() =>
                      replyText.trim() &&
                      addReply.mutate(
                        {
                          content: replyText,
                          walkthroughFileId: fileId,
                          diffPosition,
                          parentId: c.id,
                        },
                        {
                          onSuccess: () => {
                            setReplyText('');
                            setReplyTargetId(null);
                          },
                        }
                      )
                    }
                    disabled={!replyText.trim() || addReply.isPending}
                    className="p-1.5"
                  >
                    <Send className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </td>
            </tr>
          )}
        </React.Fragment>
      ))}
    </>
  );
}
