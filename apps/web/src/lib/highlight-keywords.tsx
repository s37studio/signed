import type { ReactElement } from "react";

export function highlightKeywords(text: string, keywords: string[]) {
  const parts: (string | ReactElement)[] = [];
  let lastIndex = 0;

  const activeKeywords = keywords
    .filter((k) => k && k.length > 0)
    .sort((a, b) => b.length - a.length);

  if (activeKeywords.length === 0) return <>{text}</>;

  const escapedKeywords = activeKeywords.map((k) =>
    k.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
  );

  const regex = new RegExp(`(${escapedKeywords.join("|")})`, "gi");
  let match;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.substring(lastIndex, match.index));
    }
    parts.push(
      <span key={match.index} className="text-zinc-400">
        {match[0]}
      </span>,
    );
    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }

  return <>{parts}</>;
}
