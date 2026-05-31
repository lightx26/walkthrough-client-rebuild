import { cn } from '@/lib/utils';

export function AttentionBadge({
  color,
  icon,
  children,
}: {
  color: 'emerald' | 'amber' | 'violet' | 'gray' | 'orange';
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px]',
        color === 'emerald' && 'border-emerald-200 bg-emerald-50 text-emerald-700',
        color === 'amber' && 'border-amber-200 bg-amber-50 text-amber-700',
        color === 'violet' && 'border-violet-200 bg-violet-50 text-violet-700',
        color === 'gray' && 'border-gray-200 bg-gray-50 text-gray-700',
        color === 'orange' && 'border-orange-200 bg-orange-50 text-orange-700'
      )}
    >
      {icon}
      {children}
    </span>
  );
}
