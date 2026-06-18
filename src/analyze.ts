import { RED_FLAGS } from "./redflags.js";
import { scoreFindings } from "./score.js";
import type { Config, Finding, RedFlagCategory, Report } from "./types.js";

const DEFAULT_CONFIG: Config = { ignore: [] };

function escapeRe(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// A phrase boundary that treats letters/digits as "inside a word" but lets
// hyphens, apostrophes and commas sit at the edges (so "fast-paced" and
// "we're a family" match cleanly). Whitespace in a phrase matches any run.
function phraseRegex(text: string): RegExp {
  const body = escapeRe(text).replace(/\\?\s+/g, "\\s+");
  return new RegExp(`(?<![A-Za-z0-9])${body}(?![A-Za-z0-9])`, "gi");
}

const COMPILED = RED_FLAGS.map((f) => ({ ...f, re: phraseRegex(f.text) }));

function countWords(text: string): number {
  const m = text.trim().match(/\S+/g);
  return m ? m.length : 0;
}

// Keep the longest / heaviest match when spans overlap, so "fast-paced startup"
// wins over "fast-paced" and "rockstars only" wins over "rockstar".
function dedupe(found: Finding[]): Finding[] {
  const sorted = [...found].sort((a, b) => {
    const lenA = a.end - a.start;
    const lenB = b.end - b.start;
    if (a.start !== b.start) return a.start - b.start;
    if (lenA !== lenB) return lenB - lenA;
    return b.weight - a.weight;
  });
  const kept: Finding[] = [];
  let lastEnd = -1;
  for (const f of sorted) {
    if (f.start >= lastEnd) {
      kept.push(f);
      lastEnd = f.end;
    }
  }
  return kept;
}

export function analyze(text: string, config: Partial<Config> = {}): Report {
  const cfg: Config = { ...DEFAULT_CONFIG, ...config };
  const ignore = new Set<RedFlagCategory>(cfg.ignore);

  const raw: Finding[] = [];
  for (const flag of COMPILED) {
    if (ignore.has(flag.category)) continue;
    flag.re.lastIndex = 0;
    let m: RegExpExecArray | null;
    while ((m = flag.re.exec(text)) !== null) {
      raw.push({
        category: flag.category,
        match: m[0],
        start: m.index,
        end: m.index + m[0].length,
        weight: flag.weight,
        decode: flag.decode,
      });
      if (m.index === flag.re.lastIndex) flag.re.lastIndex++;
    }
  }

  const findings = dedupe(raw).sort((a, b) => a.start - b.start);

  const byCategory: Record<RedFlagCategory, number> = {
    comp: 0,
    workload: 0,
    culture: 0,
    "vague-role": 0,
    "always-on": 0,
    exploit: 0,
    urgency: 0,
  };
  for (const f of findings) byCategory[f.category]++;

  const groups = new Map<string, { match: string; count: number; category: RedFlagCategory; decode: string }>();
  for (const f of findings) {
    // collapse internal whitespace so a phrase caught across a line-wrap
    // ("Must be\npassionate") reads as one phrase in the summary.
    const norm = f.match.replace(/\s+/g, " ");
    const key = norm.toLowerCase();
    const g = groups.get(key);
    if (g) g.count++;
    else groups.set(key, { match: norm, count: 1, category: f.category, decode: f.decode });
  }
  const topFlags = [...groups.values()].sort((a, b) => b.count - a.count || b.match.length - a.match.length);

  const words = countWords(text);
  const verdict = scoreFindings(findings, words);

  return { chars: text.length, words, findings, byCategory, topFlags, verdict };
}
