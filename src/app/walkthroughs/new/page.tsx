'use client';

import { Suspense } from 'react';

import { useRouter, useSearchParams } from 'next/navigation';

import type { CreateWalkthroughRequest } from '@/types/walkthrough';

import { WalkthroughEditor, type WalkthroughFormData } from '@/components/create-walkthrough';
import { DashboardLayout } from '@/components/layout';

import { usePullRequest, usePullRequestFiles } from '@/hooks/use-github';
import { useCreateWalkthrough } from '@/hooks/use-walkthrough';

function CreateWalkthroughContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const owner = searchParams.get('owner') ?? '';
  const repo = searchParams.get('repo') ?? '';
  const prNumber = Number(searchParams.get('prNumber'));

  const { data: prData } = usePullRequest({ owner, repo, prNumber });
  const { data: filesData, isLoading: filesLoading } = usePullRequestFiles({
    owner,
    repo,
    prNumber,
  });

  const pr = prData?.data;
  const allFiles = filesData?.data?.items ?? [];
  const createWalkthrough = useCreateWalkthrough();

  const handleSave = (data: WalkthroughFormData, status: 'DRAFT' | 'PUBLISHED') => {
    const request: CreateWalkthroughRequest = {
      owner,
      repo,
      prNumber,
      title: data.title,
      description: data.description,
      status,
      chapters: data.chapters,
    };

    createWalkthrough.mutate(request, {
      onSuccess: (resp) => {
        router.push(`/walkthroughs/${resp.data.id}`);
      },
    });
  };

  return (
    <WalkthroughEditor
      headerTitle=""
      repo={repo}
      prNumber={prNumber}
      allFiles={allFiles}
      filesLoading={filesLoading}
      initialTitle={pr?.title ?? ''}
      initialDescription={pr?.body ?? ''}
      onSave={handleSave}
      isSaving={createWalkthrough.isPending}
      requireAllFilesAssigned
    />
  );
}

export default function CreateWalkthroughPage() {
  return (
    <DashboardLayout>
      <Suspense
        fallback={
          <div className="flex flex-1 items-center justify-center">
            <div className="h-7 w-7 animate-spin rounded-full border-2 border-violet-500 border-t-transparent" />
          </div>
        }
      >
        <CreateWalkthroughContent />
      </Suspense>
    </DashboardLayout>
  );
}
