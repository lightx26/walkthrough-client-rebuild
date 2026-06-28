interface ReviewOptionProps {
  selected: boolean;
  onSelect: () => void;
  tone: 'approve' | 'reject';
  icon: React.ReactNode;
  title: string;
  description: string;
}

export function ReviewOption({ selected, onSelect, tone, icon, title, description }: ReviewOptionProps) {
  const selectedClasses =
    tone === 'approve' ? 'border-green-300 bg-green-50/60' : 'border-red-300 bg-red-50/60';
  const iconColor = tone === 'approve' ? 'text-green-600' : 'text-red-600';
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`flex w-full items-center gap-3 rounded-lg border px-3 py-2.5 text-left transition-colors ${
        selected ? selectedClasses : 'border-gray-200 hover:bg-gray-50'
      }`}
    >
      <span
        className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 ${
          selected
            ? tone === 'approve'
              ? 'border-green-500'
              : 'border-red-500'
            : 'border-gray-300'
        }`}
      >
        {selected && (
          <span
            className={`h-2 w-2 rounded-full ${tone === 'approve' ? 'bg-green-500' : 'bg-red-500'}`}
          />
        )}
      </span>
      <span className={`shrink-0 ${iconColor}`}>{icon}</span>
      <span className="min-w-0">
        <span className="block text-sm font-semibold text-gray-900">{title}</span>
        <span className="block text-xs text-gray-500">{description}</span>
      </span>
    </button>
  );
}
