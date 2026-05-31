import { cn } from '@/lib/utils';

export function MatrixLegendBadge({
  color,
  icon,
  children,
}: {
  color: 'emerald' | 'amber';
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span
        className={cn(
          'flex h-5 w-5 items-center justify-center rounded-md border',
          color === 'emerald'
            ? 'border-emerald-200 bg-emerald-50 text-emerald-600'
            : 'border-amber-200 bg-amber-50 text-amber-600'
        )}
      >
        {icon}
      </span>
      {children}
    </span>
  );
}
