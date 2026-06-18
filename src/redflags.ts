import type { RedFlagCategory } from "./types.js";

export interface RedFlag {
  text: string;
  category: RedFlagCategory;
  weight: number;
  decode: string;
}

// The moat: a curated database of job-posting phrases mapped to what they
// actually signal. Researched from the well-worn red-flag canon. Pure data.
export const RED_FLAGS: RedFlag[] = [
  // ── culture / "family" ──
  { text: "we're a family", category: "culture", weight: 4, decode: "Expect guilt trips for taking PTO and unpaid “for the team” overtime." },
  { text: "we are a family", category: "culture", weight: 4, decode: "Boundaries are “not a team player.” Healthy companies are teams, not families." },
  { text: "like a family", category: "culture", weight: 3.5, decode: "Family you can't quit, with a manager instead of love." },
  { text: "work hard, play hard", category: "culture", weight: 3, decode: "Long hours plus mandatory after-work “fun.”" },
  { text: "work hard play hard", category: "culture", weight: 3, decode: "Long hours plus mandatory after-work “fun.”" },
  { text: "drama-free", category: "culture", weight: 2, decode: "Raising a real concern will be called “drama.”" },
  { text: "no egos", category: "culture", weight: 1.5, decode: "Your reasonable pushback will be framed as ego." },
  { text: "culture fit", category: "culture", weight: 2, decode: "We hire people like us; ‘fit’ is doing a lot of work here." },
  { text: "rockstars only", category: "culture", weight: 2.5, decode: "We expect 10x output and call burnout “passion.”" },

  // ── vague role ──
  { text: "rockstar", category: "vague-role", weight: 3, decode: "We don't actually know what this role is — but we want a hero for the price of one." },
  { text: "ninja", category: "vague-role", weight: 3, decode: "Buzzword for ‘we'll figure out your job after you start.’" },
  { text: "guru", category: "vague-role", weight: 2.5, decode: "Undefined role, oversized expectations." },
  { text: "wizard", category: "vague-role", weight: 2.5, decode: "Magic is expected; clarity is not." },
  { text: "superhero", category: "vague-role", weight: 2.5, decode: "You'll rescue an under-resourced team single-handedly." },
  { text: "unicorn", category: "vague-role", weight: 3, decode: "We want five people's skills in one underpaid hire." },
  { text: "jack of all trades", category: "vague-role", weight: 2.5, decode: "One salary, several jobs." },
  { text: "swiss army knife", category: "vague-role", weight: 2.5, decode: "You'll do whatever falls through the cracks." },

  // ── workload ──
  { text: "wear many hats", category: "workload", weight: 3, decode: "We'll pay you for one job and have you do three." },
  { text: "wears many hats", category: "workload", weight: 3, decode: "We'll pay you for one job and have you do three." },
  { text: "fast-paced", category: "workload", weight: 2.5, decode: "Understaffed and chronically on fire." },
  { text: "fast paced", category: "workload", weight: 2.5, decode: "Understaffed and chronically on fire." },
  { text: "hit the ground running", category: "workload", weight: 2.5, decode: "No onboarding — the last person left a mess and quit." },
  { text: "self-starter", category: "workload", weight: 2, decode: "No manager, no process, good luck." },
  { text: "self starter", category: "workload", weight: 2, decode: "No manager, no process, good luck." },
  { text: "thrive under pressure", category: "workload", weight: 2.5, decode: "The pressure is the job." },
  { text: "thrives under pressure", category: "workload", weight: 2.5, decode: "The pressure is the job." },
  { text: "go above and beyond", category: "workload", weight: 2.5, decode: "Above and beyond is the baseline; the baseline is unpaid." },
  { text: "whatever it takes", category: "workload", weight: 2.5, decode: "Boundaries not included." },
  { text: "no task too small", category: "workload", weight: 2, decode: "You'll be doing tasks well below your level, forever." },
  { text: "roll up your sleeves", category: "workload", weight: 1.5, decode: "It's messy and you'll be cleaning it up." },
  { text: "comfortable with ambiguity", category: "workload", weight: 2, decode: "Nobody knows what's going on and that's now your problem." },
  { text: "high-growth", category: "workload", weight: 1.5, decode: "Process is an afterthought; chaos is a feature." },

  // ── always-on ──
  { text: "fast-paced startup", category: "always-on", weight: 2.5, decode: "Evenings and weekends, framed as ‘ownership.’" },
  { text: "always-on", category: "always-on", weight: 3, decode: "There is no off." },
  { text: "around the clock", category: "always-on", weight: 3, decode: "Your phone is part of the job." },
  { text: "evenings and weekends", category: "always-on", weight: 3.5, decode: "They said the quiet part out loud." },
  { text: "we move fast", category: "always-on", weight: 1.5, decode: "Often ‘we move fast and break you.’" },
  { text: "unlimited pto", category: "always-on", weight: 2, decode: "In practice people take less than with a fixed allowance — and feel guilty doing it." },
  { text: "unlimited vacation", category: "always-on", weight: 2, decode: "Unlimited in theory, frowned-upon in practice." },

  // ── comp ──
  { text: "competitive salary", category: "comp", weight: 3, decode: "If it were actually competitive, they'd print the number." },
  { text: "competitive pay", category: "comp", weight: 3, decode: "No number = below market. The good ones say it." },
  { text: "competitive compensation", category: "comp", weight: 2.5, decode: "‘Competitive’ is doing the work a real range should." },
  { text: "commensurate with experience", category: "comp", weight: 2.5, decode: "We'll lowball based on whatever you'll accept." },
  { text: "depending on experience", category: "comp", weight: 1.5, decode: "Range hidden so they can anchor low." },
  { text: "doe", category: "comp", weight: 1.5, decode: "“Depends on experience” — i.e., we won't say." },
  { text: "equity-heavy", category: "comp", weight: 2.5, decode: "Low cash, lottery-ticket equity." },
  { text: "sweat equity", category: "comp", weight: 4, decode: "Work now, maybe get paid never." },
  { text: "below market", category: "comp", weight: 3, decode: "At least they admit it." },

  // ── exploit / passion-for-pay ──
  { text: "for exposure", category: "exploit", weight: 4, decode: "Unpaid. Exposure doesn't pay rent." },
  { text: "passion project", category: "exploit", weight: 2.5, decode: "Often code for ‘underpaid.’" },
  { text: "must be passionate", category: "exploit", weight: 2.5, decode: "Your passion will be used to justify the pay." },
  { text: "passionate about", category: "exploit", weight: 1.2, decode: "Fine on its own — a flag when paired with low/undisclosed pay." },
  { text: "mission-driven", category: "exploit", weight: 1.2, decode: "Sometimes ‘accept less because the mission.’" },
  { text: "make a difference", category: "exploit", weight: 1, decode: "Watch for ‘the difference is your unpaid time.’" },
  { text: "for the love of", category: "exploit", weight: 2, decode: "‘Do it for love’ usually means ‘not for money.’" },
  { text: "rare opportunity", category: "exploit", weight: 1.5, decode: "Pressure tactic. Good jobs don't need to oversell." },
  { text: "like-minded individuals", category: "exploit", weight: 1.2, decode: "Mild — but often pairs with ‘culture fit’ gatekeeping." },

  // ── urgency / turnover ──
  { text: "immediate start", category: "urgency", weight: 2, decode: "Someone just quit. Ask why." },
  { text: "urgent hire", category: "urgency", weight: 2, decode: "A fire is burning. You may be the bucket." },
  { text: "must start asap", category: "urgency", weight: 2, decode: "Desperation rarely means a healthy team." },
  { text: "high energy", category: "urgency", weight: 1.5, decode: "Often pairs with high turnover." },
];
