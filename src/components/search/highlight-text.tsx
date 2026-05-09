interface Props {
  text: string;
  query: string;
}

export function HighlightText({ text, query }: Props) {
  if (!query.trim()) return <span>{text}</span>;

  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi");
  const parts = text.split(regex);

  return (
    <span>
      {parts.map((part, i) =>
        regex.test(part) ? (
          <span key={i} className="text-indigo-600 font-semibold">
            {part}
          </span>
        ) : (
          part
        ),
      )}
    </span>
  );
}
