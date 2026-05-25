"use client";

import { useEffect, type ReactNode } from "react";
import { AlertTriangle, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export type ConfirmDialogTone = "warning" | "danger" | "info";

const TONE_STYLES: Record<
  ConfirmDialogTone,
  { iconBg: string; iconColor: string; confirmVariant: "primary" | "destructive" }
> = {
  warning: {
    iconBg: "bg-amber-50",
    iconColor: "text-amber-500",
    confirmVariant: "primary",
  },
  danger: {
    iconBg: "bg-red-50",
    iconColor: "text-red-500",
    confirmVariant: "destructive",
  },
  info: {
    iconBg: "bg-violet-50",
    iconColor: "text-violet-500",
    confirmVariant: "primary",
  },
};

interface Props {
  open: boolean;
  title: string;
  description?: ReactNode;
  tone?: ConfirmDialogTone;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  open,
  title,
  description,
  tone = "warning",
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  onConfirm,
  onCancel,
}: Props) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onCancel]);

  if (!open) return null;

  const styles = TONE_STYLES[tone];

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 px-4"
      onClick={onCancel}
    >
      <div
        className="bg-white rounded-2xl shadow-xl w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
      >
        <div className="flex items-start gap-3 px-5 py-4 border-b border-gray-100">
          <div
            className={cn(
              "w-9 h-9 rounded-lg flex items-center justify-center shrink-0",
              styles.iconBg,
            )}
          >
            <AlertTriangle className={cn("w-4 h-4", styles.iconColor)} />
          </div>
          <h2
            id="confirm-dialog-title"
            className="flex-1 font-semibold text-gray-900 text-base pt-1.5"
          >
            {title}
          </h2>
          <Button
            variant="ghost"
            size="iconSm"
            onClick={onCancel}
            className="text-muted-foreground"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {description && (
          <div className="px-5 py-4 text-sm text-gray-600 leading-relaxed">
            {description}
          </div>
        )}

        <div className="flex items-center justify-end gap-2 px-5 py-3 border-t border-gray-100">
          <Button variant="outline" size="sm" onClick={onCancel}>
            {cancelLabel}
          </Button>
          <Button
            variant={styles.confirmVariant}
            size="sm"
            onClick={onConfirm}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
