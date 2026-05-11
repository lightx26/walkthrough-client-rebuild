export type DiffLineType = "hunk" | "add" | "del" | "ctx";

export interface DiffLine {
  type: DiffLineType;
  content: string;
  oldNo?: number;
  newNo?: number;
}

export function parsePatch(rawPatch: string): DiffLine[] {
  const lines = rawPatch.split("\n");
  const result: DiffLine[] = [];
  let oldLine = 0;
  let newLine = 0;
  for (const line of lines) {
    if (line.startsWith("@@")) {
      const match = line.match(/@@ -(\d+)(?:,\d+)? \+(\d+)(?:,\d+)? @@/);
      if (match) {
        oldLine = parseInt(match[1], 10);
        newLine = parseInt(match[2], 10);
      }
      result.push({ type: "hunk", content: line });
    } else if (line.startsWith("+")) {
      result.push({ type: "add", content: line.slice(1), newNo: newLine++ });
    } else if (line.startsWith("-")) {
      result.push({ type: "del", content: line.slice(1), oldNo: oldLine++ });
    } else if (line.startsWith(" ") || line === "") {
      result.push({ type: "ctx", content: line.slice(1), oldNo: oldLine++, newNo: newLine++ });
    }
  }
  return result;
}

export function computeDiffStats(rawPatch: string): { added: number; removed: number } {
  let added = 0;
  let removed = 0;
  for (const line of rawPatch.split("\n")) {
    if (line.startsWith("+") && !line.startsWith("+++")) added++;
    else if (line.startsWith("-") && !line.startsWith("---")) removed++;
  }
  return { added, removed };
}
