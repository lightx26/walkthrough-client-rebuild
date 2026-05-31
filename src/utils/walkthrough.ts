import type { WalkthroughStatus } from '@/types/walkthrough';

export type DisplayStatus = 'Published' | 'Draft' | 'Outdated';

export function toDisplayStatus(status: WalkthroughStatus): DisplayStatus | null {
  if (status === 'PUBLISHED') return 'Published';
  if (status === 'DRAFT') return 'Draft';
  if (status === 'OUTDATED') return 'Outdated';
  return null;
}
