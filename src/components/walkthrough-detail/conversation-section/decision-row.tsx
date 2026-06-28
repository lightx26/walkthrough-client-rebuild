import { CheckCircle2, XCircle } from 'lucide-react';

import type { ReviewDecision } from '@/types/walkthrough';

import { formatRelativeTime } from '@/utils/date-diff';

interface DecisionRowProps {
  decision: ReviewDecision;
}

export function DecisionRow({ decision }: DecisionRowProps) {
  const approved = decision.decision === 'APPROVED';
  return (
    <div className="flex items-start gap-3 px-1 py-1.5">
      <span
        className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${
          approved ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
        }`}
      >
        {approved ? <CheckCircle2 className="h-3.5 w-3.5" /> : <XCircle className="h-3.5 w-3.5" />}
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-sm text-gray-600">
          <span className="font-semibold text-gray-900">{decision.username}</span>{' '}
          {approved ? 'approved these changes' : 'requested changes'}{' '}
          <span className="text-xs text-gray-400">{formatRelativeTime(decision.updatedAt)}</span>
        </p>
        {decision.comment && (
          <p className="mt-1 text-sm leading-relaxed text-gray-600">{decision.comment}</p>
        )}
      </div>
    </div>
  );
}
