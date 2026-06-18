# is-this-job-toxic 🚩

**Paste a job posting. Get its red flags decoded into what they actually mean — with zero AI.**

> “We’re a family” → *expect guilt trips for taking PTO and unpaid overtime.*
> “Fast-paced” → *understaffed and chronically on fire.*
> “Competitive salary” → *if it were competitive, they’d print the number.*
> “Rockstar ninja” → *we don’t actually know what this role is.*

A tiny, **100% local, rule-based** tool that scans a job description against a curated database of well-worn corporate red flags, scores its toxicity **0–100**, and tells you — for each flag — *what it really means.* No API key, no model, **nothing leaves your machine.**

### 🌐 [**Try it in your browser →**](https://didrod205.github.io/is-this-job-toxic/)

Paste a posting, watch the flags light up. Nothing is uploaded — the whole engine runs client-side.

```bash
npx is-this-job-toxic "We're a family and we move fast. Looking for a rockstar who can wear many hats."
```

```
  100/100 ████████████████████ Run. 🏃🚩
  4 red flags in 16 words

  What they said → what it really means
    “We're a family” · “Family” boundaries
      ↳ Expect guilt trips for taking PTO and unpaid “for the team” overtime.
    “rockstar” · Vague role
      ↳ We don't actually know what this role is — but we want a hero for the price of one.
    “wear many hats” · Overwork
      ↳ We'll pay you for one job and have you do three.
    “move fast” · Always on
      ↳ Often ‘we move fast and break you.’
```

## Why

Job postings have their own dialect. A lot of the friendly-sounding phrases are
load-bearing euphemisms — they tell you about the pay, the hours, and the
boundaries *if you know how to read them*. This decodes that dialect: it
highlights the phrases, groups them by what they signal, and translates each one.

It’s a **decoder, not a verdict machine.** A great company can write a clumsy
posting, and a toxic one can hire a good copywriter. Red flags are *signals* —
use them to ask better questions in the interview, not to auto-reject.

## Install

```bash
npm i -g is-this-job-toxic     # then:  is-this-job-toxic posting.txt
# or zero-install:
npx is-this-job-toxic posting.txt
```

## Usage

```bash
is-this-job-toxic "paste the text right here"     # a string
is-this-job-toxic posting.txt                     # a file
pbpaste | is-this-job-toxic                        # the clipboard (macOS)
is-this-job-toxic posting.txt --md > report.md     # Markdown table
is-this-job-toxic posting.txt --json               # machine-readable
```

`redflags` is a shorter alias for the same command.

### Flags

| Flag | What it does |
| --- | --- |
| `--md [file]` | Markdown table (`What they said → what it really means`) |
| `--json [file]` | Full report as JSON |
| `--max-score <n>` | Exit `1` if toxicity exceeds `n` — a CI gate for recruiters de-toxifying their own postings |
| `--ignore <category>` | Skip a category (repeatable) |
| `--quiet` | No pretty output (use with `--max-score`) |
| `--no-color` | Disable ANSI colors |

### For recruiters: lint your own postings

Run it on your job description in CI and fail the build if it’s too toxic:

```bash
is-this-job-toxic job-descriptions/backend.md --max-score 20 --quiet
```

## The categories

| Category | Signals |
| --- | --- |
| **Pay (hidden / low)** | “competitive salary”, “commensurate with experience”, “equity-heavy” |
| **Overwork** | “wear many hats”, “fast-paced”, “go above and beyond”, “self-starter” |
| **“Family” boundaries** | “we’re a family”, “work hard, play hard”, “no egos” |
| **Vague role** | “rockstar”, “ninja”, “guru”, “unicorn”, “jack of all trades” |
| **Always on** | “evenings and weekends”, “around the clock”, “unlimited PTO” |
| **Passion-for-pay** | “for exposure”, “must be passionate”, “rare opportunity” |
| **Desperation** | “immediate start”, “urgent hire”, “must start ASAP” |

## Library

The core is pure and browser-safe (no `node:*`), so you can use it anywhere:

```ts
import { analyze } from "is-this-job-toxic";

const report = analyze("We're a family and we move fast.");
report.verdict.score;   // 100
report.verdict.band;    // "run"
report.topFlags[0];     // { match: "We're a family", category: "culture", decode: "Expect guilt trips…", count: 1 }
```

## How the score works

Each red flag carries a weight; toxicity is the accumulated weight, scaled and
capped at 100. We deliberately **don’t** normalize by length — a red flag is a
red flag whether the posting is 80 words or 800 — so the score stays
predictable and we can always show you exactly which phrases produced it.

| Score | Band | |
| --- | --- | --- |
| 0–19 | **Looks healthy** | ✅ |
| 20–44 | **A few red flags** | 🟡 |
| 45–69 | **Proceed with caution** | 🚩 |
| 70–100 | **Run.** | 🏃🚩 |

## Privacy

Everything runs locally. The CLI reads your text, scores it in memory, and
prints the result. The web playground runs the **exact same engine** compiled to
the browser — open the network tab, you’ll see nothing leave. No telemetry, no
account, no upload. Ever.

## Contributing

The most useful contribution is **a new red flag** — a phrase, the category it
signals, and an honest, funny-but-true decode. See [CONTRIBUTING.md](CONTRIBUTING.md).

## License

MIT © [didrod205](https://github.com/didrod205)

---

<sub>A rule-based decoder, not a polygraph. It reads the *clichés* — your judgment reads the room.</sub>
