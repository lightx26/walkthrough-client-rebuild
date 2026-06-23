'use client';

import { useState } from 'react';

import { CheckCircle2, ThumbsDown, ThumbsUp, XCircle } from 'lucide-react';

import { UserAvatar } from '@/components/ui';
import { Button } from '@/components/ui/button';

import {
  useMyReviewDecision,
  useReviewDecisions,
  useSubmitReviewDecision,
  useWithdrawReviewDecision,
} from '@/hooks/use-walkthrough';

interface ReviewDecisionSectionProps {
  walkthroughId: string;
  isOwner: boolean;
}

export function ReviewDecisionSection({ walkthroughId, isOwner }: ReviewDecisionSectionProps) {
  const [comment, setComment] = useState('');

  const { data: decisionsData } = useReviewDecisions(walkthroughId);
  const { data: myDecisionData } = useMyReviewDecision(walkthroughId);

  const submitDecision = useSubmitReviewDecision(walkthroughId);
  const withdrawDecision = useWithdrawReviewDecision(walkthroughId);

  const decisions = decisionsData?.data?.items ?? [];
  const myDecision = myDecisionData?.data ?? null;

  if (isOwner) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white">
        <div className="flex items-center gap-2 border-b border-gray-100 px-6 py-4">
          <CheckCircle2 className="h-4 w-4 text-gray-400" />
          <h3 className="font-semibold text-gray-900">Reviews</h3>
          <span className="text-sm text-gray-400">{decisions.length}</span>
        </div>

        {decisions.length === 0 ? (
          <p className="px-6 py-4 text-sm text-gray-400">No reviews yet.</p>
        ) : (
          <div className="divide-y divide-gray-100">
            {decisions.map((d) => (
              <div key={d.id} className="flex items-start gap-3 px-6 py-3.5">
                <UserAvatar
                  src={d.avatarUrl}
                  displayName={d.username}
                  username={d.username}
                  size="sm"
                  className="mt-0.5 shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-900">{d.username}</span>
                    {d.decision === 'APPROVED' ? (
                      <span className="flex items-center gap-1 rounded-full bg-green-50 px-2 py-0.5 text-xs font-medium text-green-700">
                        <CheckCircle2 className="h-3 w-3" />
                        Approved
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 rounded-full bg-red-50 px-2 py-0.5 text-xs font-medium text-red-700">
                        <XCircle className="h-3 w-3" />
                        Rejected
                      </span>
                    )}
                  </div>
                  {d.comment && (
                    <p className="mt-1 text-sm leading-relaxed text-gray-600">{d.comment}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white">
      <div className="flex items-center gap-2 border-b border-gray-100 px-6 py-4">
        <CheckCircle2 className="h-4 w-4 text-gray-400" />
        <h3 className="font-semibold text-gray-900">Submit your review</h3>
      </div>

      <div className="px-6 py-4">
        {myDecision ? (
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              {myDecision.decision === 'APPROVED' ? (
                <div className="flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 px-4 py-2.5">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium text-green-800">You approved this PR</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5">
                  <XCircle className="h-4 w-4 text-red-600" />
                  <span className="text-sm font-medium text-red-800">You rejected this PR</span>
                </div>
              )}
            </div>
            {myDecision.comment && (
              <p className="text-sm text-gray-600">{myDecision.comment}</p>
            )}
            <div className="flex gap-2">
              {myDecision.decision === 'REJECTED' && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    submitDecision.mutate({ decision: 'APPROVED', comment: myDecision.comment ?? undefined })
                  }
                  disabled={submitDecision.isPending}
                  className="gap-1.5 rounded-xl border-green-300 text-green-700 hover:bg-green-50"
                >
                  <ThumbsUp className="h-3.5 w-3.5" />
                  Change to Approve
                </Button>
              )}
              {myDecision.decision === 'APPROVED' && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    submitDecision.mutate({ decision: 'REJECTED', comment: myDecision.comment ?? undefined })
                  }
                  disabled={submitDecision.isPending}
                  className="gap-1.5 rounded-xl border-red-300 text-red-700 hover:bg-red-50"
                >
                  <ThumbsDown className="h-3.5 w-3.5" />
                  Change to Reject
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={() => withdrawDecision.mutate()}
                disabled={withdrawDecision.isPending}
                className="gap-1.5 rounded-xl text-gray-600"
              >
                Withdraw review
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <textarea
              rows={2}
              className="w-full resize-none rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-700 outline-none placeholder:text-gray-300 focus:border-violet-400 focus:bg-white"
              placeholder="Leave a comment (optional)..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              maxLength={1000}
            />
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  submitDecision.mutate(
                    { decision: 'APPROVED', comment: comment.trim() || undefined },
                    { onSuccess: () => setComment('') }
                  )
                }
                disabled={submitDecision.isPending}
                className="gap-1.5 rounded-xl border-green-300 text-green-700 hover:bg-green-50"
              >
                <ThumbsUp className="h-3.5 w-3.5" />
                Approve
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  submitDecision.mutate(
                    { decision: 'REJECTED', comment: comment.trim() || undefined },
                    { onSuccess: () => setComment('') }
                  )
                }
                disabled={submitDecision.isPending}
                className="gap-1.5 rounded-xl border-red-300 text-red-700 hover:bg-red-50"
              >
                <ThumbsDown className="h-3.5 w-3.5" />
                Reject
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
