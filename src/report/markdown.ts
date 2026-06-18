import type { Report } from "../types.js";
import { CATEGORY_LABELS } from "../types.js";

export function toMarkdown(r: Report): string {
  const L: string[] = [];
  L.push(`# is-this-job-toxic — ${r.verdict.score}/100`);
  L.push("");
  L.push(`> **${r.verdict.label}**`);
  L.push("");
  L.push(`${r.findings.length} red flag${r.findings.length === 1 ? "" : "s"} in ${r.words} words.`);
  L.push("");
  if (r.topFlags.length > 0) {
    L.push("**What they said → what it really means**");
    L.push("");
    L.push("| Phrase | Count | Category | What it really means |");
    L.push("| --- | --- | --- | --- |");
    for (const t of r.topFlags) {
      L.push(`| \`${t.match}\` | ×${t.count} | ${CATEGORY_LABELS[t.category]} | ${t.decode} |`);
    }
    L.push("");
  } else {
    L.push("No red flags from our database. Looks clean. ✅");
    L.push("");
  }
  L.push("---");
  L.push("<sub>scored locally by [is-this-job-toxic](https://github.com/didrod205/is-this-job-toxic) — rule-based, no AI, nothing uploaded. Red flags ≠ certainty.</sub>");
  return L.join("\n") + "\n";
}
