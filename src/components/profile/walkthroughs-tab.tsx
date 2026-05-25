"use client";

import { WalkthroughList } from "@/components/home";
import type { WalkthroughSummary } from "@/types/walkthrough";

interface WalkthroughsTabProps {
  allWalkthroughs?: WalkthroughSummary[];
  isLoading: boolean;
}

export function WalkthroughsTab({
  allWalkthroughs,
  isLoading,
}: WalkthroughsTabProps) {
  return (
    <WalkthroughList
      walkthroughs={allWalkthroughs ?? []}
      isLoading={isLoading}
    />
  );
}
