import { cn } from '@/lib/utils';

export function ProgressDots({ read, total }: { read: number; total: number }) {
  if (total <= 0) return null;
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: total }).map((_, i) => (
        <span
          key={i}
          className={cn('h-2.5 w-2.5 rounded-full', i < read ? 'bg-violet-500' : 'bg-gray-200')}
        />
      ))}
    </div>
  );
}
