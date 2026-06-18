// Pure, browser-safe data model — powers the CLI and the web playground.

export type RedFlagCategory =
  | "comp" // hidden / low pay
  | "workload" // understaffed, overwork
  | "culture" // boundary-violating "family" stuff
  | "vague-role" // rockstar/ninja — nobody knows the job
  | "always-on" // no work-life balance
  | "exploit" // passion-for-pay, unpaid
  | "urgency"; // desperation, high turnover

export interface Finding {
  category: RedFlagCategory;
  /** The matched phrase. */
  match: string;
  start: number;
  end: number;
  weight: number;
  /** What it really means. */
  decode: string;
}

export type Band = "healthy" | "flags" | "caution" | "run";

export interface Verdict {
  /** 0–100; higher = more toxic. */
  score: number;
  band: Band;
  label: string;
}

export interface Report {
  chars: number;
  words: number;
  findings: Finding[];
  byCategory: Record<RedFlagCategory, number>;
  topFlags: { match: string; count: number; category: RedFlagCategory; decode: string }[];
  verdict: Verdict;
}

export interface Config {
  ignore: RedFlagCategory[];
}

export const CATEGORY_LABELS: Record<RedFlagCategory, string> = {
  comp: "Pay (hidden / low)",
  workload: "Overwork",
  culture: "“Family” boundaries",
  "vague-role": "Vague role",
  "always-on": "Always on",
  exploit: "Passion-for-pay",
  urgency: "Desperation",
};
