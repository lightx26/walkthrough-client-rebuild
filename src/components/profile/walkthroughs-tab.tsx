'use client';

import type { WalkthroughSummary } from '@/types/walkthrough';

import { WalkthroughList } from '@/components/home';

interface WalkthroughsTabProps {
  allWalkthroughs?: WalkthroughSummary[];
  isLoading: boolean;
}

export function WalkthroughsTab({ allWalkthroughs, isLoading }: WalkthroughsTabProps) {
  return <WalkthroughList walkthroughs={allWalkthroughs ?? []} isLoading={isLoading} />;
}
