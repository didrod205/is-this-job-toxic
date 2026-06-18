import pc from "picocolors";
import type { Band, Report } from "../types.js";
import { CATEGORY_LABELS } from "../types.js";
import { toSegments } from "../highlight.js";

function bandPaint(band: Band, s: string): string {
  if (band === "healthy") return pc.green(s);
  if (band === "flags") return pc.cyan(s);
  if (band === "caution") return pc.yellow(s);
  return pc.red(s);
}

function bandEmoji(band: Band): string {
  if (band === "healthy") return "✅";
  if (band === "flags") return "🟡";
  if (band === "caution") return "🚩";
  return "🏃🚩";
}

function gauge(score: number): string {
  const filled = Math.round(score / 5);
  return "█".repeat(filled) + pc.dim("░".repeat(20 - filled));
}

/** Highlighted posting + verdict + the "what they said → what it means" table. */
export function renderConsole(r: Report, text: string): string {
  const L: string[] = [];
  const ind = "  ";
  L.push("");

  // highlighted posting (red flags underlined)
  if (text.length <= 4000 && r.findings.length > 0) {
    const body = toSegments(text, r.findings)
      .map((seg) => (seg.finding ? pc.red(pc.underline(seg.text)) : seg.text))
      .join("");
    L.push(
      body
        .split("\n")
        .map((line) => ind + line)
        .join("\n"),
    );
    L.push("");
  }

  // verdict
  L.push(
    `${ind}${bandPaint(r.verdict.band, pc.bold(`${r.verdict.score}/100`))} ${gauge(r.verdict.score)} ${bandPaint(r.verdict.band, pc.bold(r.verdict.label))} ${bandEmoji(r.verdict.band)}`,
  );
  L.push(`${ind}${pc.dim(`${r.findings.length} red flag${r.findings.length === 1 ? "" : "s"} in ${r.words} words`)}`);
  L.push("");

  // the decode table — the part worth screenshotting
  if (r.topFlags.length > 0) {
    L.push(`${ind}${pc.bold("What they said")} ${pc.dim("→ what it really means")}`);
    const shown = r.topFlags.slice(0, 12);
    for (const t of shown) {
      L.push(`${ind}  ${pc.red(`“${t.match}”`)}${t.count > 1 ? pc.dim(" ×" + t.count) : ""} ${pc.dim("· " + CATEGORY_LABELS[t.category])}`);
      L.push(`${ind}    ${pc.yellow("↳ " + t.decode)}`);
    }
    if (r.topFlags.length > shown.length) {
      L.push(`${ind}  ${pc.dim(`+${r.topFlags.length - shown.length} more flagged — see --md or --json`)}`);
    }
    L.push("");
    L.push(`${ind}${pc.dim("rule-based, no AI, nothing left your machine. red flags ≠ certainty — use judgment.")}`);
    L.push("");
  } else {
    L.push(`${ind}${pc.green("No red flags in our database. Looks clean — but trust your gut in the interview too.")}`);
    L.push("");
  }
  return L.join("\n");
}
