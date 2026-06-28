interface TabButtonProps {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}

export function TabButton({ active, onClick, icon, label }: TabButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-1.5 border-b-2 px-3 py-2.5 text-sm font-medium transition-colors ${
        active
          ? 'border-violet-500 text-gray-900'
          : 'border-transparent text-gray-400 hover:text-gray-600'
      }`}
    >
      {icon}
      {label}
    </button>
  );
}
