import type { Config, RedFlagCategory } from "./types.js";

export const CATEGORIES: RedFlagCategory[] = [
  "comp",
  "workload",
  "culture",
  "vague-role",
  "always-on",
  "exploit",
  "urgency",
];

export function normalizeConfig(input: Partial<Config> | undefined): Config {
  const ignore = (input?.ignore ?? []).filter((c): c is RedFlagCategory =>
    CATEGORIES.includes(c as RedFlagCategory),
  );
  return { ignore };
}
