const LANGUAGE_COLORS: Record<string, string> = {
  TypeScript: 'bg-blue-500',
  JavaScript: 'bg-yellow-400',
  Java: 'bg-orange-500',
  Python: 'bg-blue-400',
  Go: 'bg-cyan-400',
  Rust: 'bg-orange-600',
  Ruby: 'bg-red-500',
  'C#': 'bg-purple-500',
  'C++': 'bg-pink-500',
  C: 'bg-gray-500',
  Kotlin: 'bg-violet-500',
  Swift: 'bg-orange-400',
  Dockerfile: 'bg-blue-600',
  Shell: 'bg-green-500',
  HTML: 'bg-orange-400',
  CSS: 'bg-blue-400',
  SCSS: 'bg-pink-400',
};

export function languageColor(lang: string | null): string {
  if (!lang) return 'bg-gray-400';
  return LANGUAGE_COLORS[lang] ?? 'bg-gray-400';
}
