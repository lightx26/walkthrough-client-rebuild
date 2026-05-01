export function formatRelativeDate(iso: string): string {
  const date = new Date(iso);
  if (isNaN(date.getTime())) return "";
  const diff = Date.now() - date.getTime();
  const days = Math.floor(diff / 86_400_000);
  if (days === 0) return "Updated today";
  if (days === 1) return "Updated yesterday";
  if (days < 30) return `Updated ${days} days ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `Updated ${months} month${months > 1 ? "s" : ""} ago`;
  const years = Math.floor(months / 12);
  return `Updated ${years} year${years > 1 ? "s" : ""} ago`;
}
