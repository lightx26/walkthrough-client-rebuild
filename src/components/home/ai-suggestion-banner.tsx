import { Sparkles, X } from 'lucide-react';

import { Button } from '@/components/ui/button';

interface AiSuggestionBannerProps {
  onDismiss: () => void;
}

export function AiSuggestionBanner({ onDismiss }: AiSuggestionBannerProps) {
  return (
    <div className="mb-5 flex items-start gap-3 rounded-xl border border-violet-100 bg-violet-50 p-4">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-violet-100">
        <Sparkles className="h-4 w-4 text-violet-600" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="mb-0.5 text-sm font-semibold text-violet-900">AI chapter suggestion ready</p>
        <p className="text-sm text-violet-700">
          Claude analyzed &ldquo;Break down PR into chapters&rdquo; — 5 chapters suggested based on
          dependency graph.
        </p>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <Button
          variant="link"
          size="none"
          className="gap-0.5 text-sm font-semibold text-violet-700 no-underline hover:text-violet-900 hover:no-underline"
        >
          Review <span className="ml-0.5">→</span>
        </Button>
        <Button
          variant="ghost"
          size="none"
          onClick={onDismiss}
          className="p-0.5 text-violet-300 hover:bg-transparent hover:text-violet-600"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
