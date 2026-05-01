import { Sparkles, X } from "lucide-react";

interface AiSuggestionBannerProps {
  onDismiss: () => void;
}

export function AiSuggestionBanner({ onDismiss }: AiSuggestionBannerProps) {
  return (
    <div className="flex items-start gap-3 bg-violet-50 border border-violet-100 rounded-xl p-4 mb-5">
      <div className="w-8 h-8 rounded-lg bg-violet-100 flex items-center justify-center shrink-0">
        <Sparkles className="w-4 h-4 text-violet-600" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-violet-900 mb-0.5">
          AI chapter suggestion ready
        </p>
        <p className="text-sm text-violet-700">
          Claude analyzed &ldquo;Break down PR into chapters&rdquo; — 5 chapters
          suggested based on dependency graph.
        </p>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <button className="text-sm font-semibold text-violet-700 hover:text-violet-900 flex items-center gap-0.5 transition-colors">
          Review <span className="ml-0.5">→</span>
        </button>
        <button
          onClick={onDismiss}
          className="p-0.5 text-violet-300 hover:text-violet-600 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
