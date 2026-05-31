import type { WalkthroughStatus } from '@/types/walkthrough';

export function WalkthroughStatusBadge({ status }: { status: WalkthroughStatus }) {
  if (status === 'PUBLISHED')
    return (
      <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700">
        Published
      </span>
    );
  if (status === 'DRAFT')
    return (
      <span className="rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-[11px] font-medium text-amber-700">
        Draft
      </span>
    );
  if (status === 'OUTDATED')
    return (
      <span className="rounded-full border border-gray-200 bg-gray-100 px-2 py-0.5 text-[11px] font-medium text-gray-500">
        Outdated
      </span>
    );
  return (
    <span className="rounded-full border border-gray-200 bg-gray-100 px-2 py-0.5 text-[11px] font-medium text-gray-500">
      Deprecated
    </span>
  );
}
