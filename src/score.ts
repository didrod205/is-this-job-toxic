import type { Band, Finding, Verdict } from "./types.js";

// Toxicity is the accumulated weight of red flags, capped at 100. A red flag is
// a red flag whether the posting is 80 words or 800, so we deliberately do NOT
// normalize by length — that keeps the score predictable and explainable: each
// flag adds `its weight × K`, and we tell you exactly which flags added it.
const K = 4.5;

const BANDS: { max: number; band: Band; label: string }[] = [
  { max: 20, band: "healthy", label: "Looks healthy" },
  { max: 45, band: "flags", label: "A few red flags" },
  { max: 70, band: "caution", label: "Proceed with caution" },
  { max: Infinity, band: "run", label: "Run." },
];

export function scoreFindings(findings: Finding[], _words: number): Verdict {
  const raw = findings.reduce((sum, f) => sum + f.weight, 0);
  const score = Math.max(0, Math.min(100, Math.round(raw * K)));
  const hit = BANDS.find((b) => score < b.max) ?? BANDS[BANDS.length - 1]!;
  return { score, band: hit.band, label: hit.label };
}
