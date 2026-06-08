'use client';

import { useEffect } from 'react';
import { X, ShieldAlert } from 'lucide-react';
import type { RiskZone } from '@/types/risk';
import { Button } from '@/components/ui/button';
import { RiskCard } from './risk-card';

interface FileRisksPopupProps {
  open: boolean;
  filename: string;
  risks: RiskZone[];
  walkthroughId: string;
  onClose: () => void;
}

export function FileRisksPopup({ open, filename, risks, walkthroughId, onClose }: FileRisksPopupProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-60 flex items-center justify-center bg-black/40 px-4"
      onClick={onClose}
    >
      <div
        className="flex w-full max-w-3xl flex-col rounded-2xl bg-white shadow-xl max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="file-risks-popup-title"
      >
        <div className="flex items-center gap-2 border-b border-gray-100 px-5 py-4">
          <ShieldAlert className="h-4 w-4 shrink-0 text-red-500" />
          <h2
            id="file-risks-popup-title"
            className="min-w-0 flex-1 truncate text-sm font-semibold text-gray-900 font-mono"
            title={filename}
          >
            {filename}
          </h2>
          <span className="shrink-0 text-xs text-gray-400">
            {risks.length} {risks.length === 1 ? 'risk' : 'risks'}
          </span>
          <Button
            variant="ghost"
            size="iconSm"
            onClick={onClose}
            className="text-muted-foreground"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="overflow-y-auto p-4 space-y-3">
          {risks.map((risk) => (
            <RiskCard key={risk.id} risk={risk} walkthroughId={walkthroughId} />
          ))}
        </div>
      </div>
    </div>
  );
}
