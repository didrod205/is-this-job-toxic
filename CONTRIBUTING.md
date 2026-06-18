# Contributing to is-this-job-toxic

Thanks for your interest! The most welcome contribution is a **new red flag** — a
job-posting phrase, the category it signals, and an honest decode of what it
really means.

## Getting started

```bash
git clone https://github.com/didrod205/is-this-job-toxic.git
cd is-this-job-toxic
npm install
npm test            # vitest
npm run typecheck
npm run build       # tsup → dist/
npm run dev         # the playground at localhost:5173
npm run example     # score the bundled toxic sample
```

## Project layout

```
src/
  redflags.ts   # the curated database: { text, category, weight, decode } (pure)
  analyze.ts    # run the flags → findings with spans + dedupe overlaps (pure)
  score.ts      # weighted toxicity score + verdict bands (pure)
  highlight.ts  # findings → plain/flagged segments for rendering (pure)
  config.ts / load-config.ts
  report/       # console (decoded) / markdown (table) / json
  cli.ts        # cac CLI
web/            # the Vite playground (reuses src/ directly)
tests/          # detection + calibration + span/dedupe checks
```

## Adding a red flag

Add an entry to `RED_FLAGS` in `src/redflags.ts`:

```ts
{ text: "work-life balance is important to us", category: "always-on", weight: 2,
  decode: "Stated so often because it usually isn't." },
```

- **`text`** — lowercase; spaces match any whitespace (so it catches line-wraps).
- **`category`** — `comp | workload | culture | vague-role | always-on | exploit | urgency`.
- **`weight`** — roughly 1 (mild) to 4 (blaring). A single weight-4 flag is a
  near-instant “caution.”
- **`decode`** — the honest, funny-but-*true* translation. This is the heart of
  the project. Punchy beats preachy.

Add a test: the flag fires on an obvious example, and the calibration tests stay
green (a stuffed posting > 70, a clear and fair one < 20).

## The one rule

This is a **decoder, not a polygraph.** Don’t add flags that fire on normal,
healthy postings — a fair job description must keep scoring near zero. A phrase
earns a place only if it’s a genuine, widely-recognized euphemism. Keep the
decodes honest: punchy is good, but a decode that’s just cynical (not *true*)
makes the tool dumber. False positives are how a tool like this becomes noise.

## Quality bar

- [ ] `npm run typecheck && npm test && npm run build` pass.
- [ ] Calibration holds (a fair posting stays low).
- [ ] The core imports no `node:*` — keep it browser-safe (the playground needs it).
