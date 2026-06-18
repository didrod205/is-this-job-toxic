import { analyze, toSegments, CATEGORY_LABELS } from "../src/index.js";

const $ = <T extends HTMLElement>(id: string) => document.getElementById(id) as T;
const input = $<HTMLTextAreaElement>("input");
const result = $<HTMLElement>("result");
const scoreEl = $<HTMLElement>("score");
const labelEl = $<HTMLElement>("label");
const subEl = $<HTMLElement>("sub");
const decoder = $<HTMLElement>("decoder");
const decoderTitle = $<HTMLElement>("decoder-title");
const highlighted = $<HTMLElement>("highlighted");
const card = document.querySelector(".scorecard") as HTMLElement;

const TOXIC_SAMPLE = `Rockstar Full-Stack Ninja Wanted 🚀

We're a family here, and we work hard, play hard. We're looking for a self-starter who can wear many hats and hit the ground running in our fast-paced startup. No task too small! You thrive under pressure and are willing to go above and beyond — whatever it takes to ship.

You'll be a true unicorn: part engineer, part designer, part support guru. Must be passionate about our mission. This is a rare opportunity to make a difference.

Compensation: competitive salary, commensurate with experience. Equity-heavy for the right person. Unlimited PTO. Immediate start — we need someone ASAP.`;

const FAIR_SAMPLE = `Senior Backend Engineer (Remote, EU timezones)

Salary: €75,000–€95,000 depending on level, reviewed every year. We publish the band because we think you deserve to know before you apply.

The role: you'll own our billing service — designing APIs, writing Go, and improving our test coverage. A typical week is focused work with two short standups. We protect deep-work time and do not expect availability after hours.

What we offer: 30 days of paid vacation (and we track that managers actually take it), a €1,500 yearly learning budget, and a four-day onboarding plan with a named mentor.

Interview: a 45-minute intro, one take-home (paid, capped at 3 hours), and a technical conversation. We give feedback at every stage.`;

function escapeHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function render(): void {
  const text = input.value;
  if (text.trim() === "") {
    result.classList.add("hidden");
    return;
  }
  result.classList.remove("hidden");
  const r = analyze(text);

  scoreEl.textContent = String(r.verdict.score);
  labelEl.textContent = r.verdict.label;
  const n = r.findings.length;
  subEl.textContent = `${n} red flag${n === 1 ? "" : "s"} in ${r.words} words`;
  card.className = "scorecard band-" + r.verdict.band;

  if (r.topFlags.length > 0) {
    decoderTitle.classList.remove("hidden");
    decoder.innerHTML = r.topFlags
      .map(
        (t) => `<div class="decode-row">
          <div class="said"><span class="q">“${escapeHtml(t.match)}”</span>${t.count > 1 ? ` <span class="x">×${t.count}</span>` : ""}<span class="cat">${escapeHtml(CATEGORY_LABELS[t.category])}</span></div>
          <div class="means">${escapeHtml(t.decode)}</div>
        </div>`,
      )
      .join("");
  } else {
    decoderTitle.classList.add("hidden");
    decoder.innerHTML = `<div class="empty">No red flags from our database. Looks clean — but trust your gut in the interview too. ✅</div>`;
  }

  highlighted.innerHTML = toSegments(text, r.findings)
    .map((seg) =>
      seg.finding
        ? `<mark class="flag" title="${escapeHtml(seg.finding.decode)}">${escapeHtml(seg.text)}</mark>`
        : escapeHtml(seg.text),
    )
    .join("");
}

input.addEventListener("input", render);
$<HTMLButtonElement>("sample-toxic").addEventListener("click", () => {
  input.value = TOXIC_SAMPLE;
  render();
});
$<HTMLButtonElement>("sample-fair").addEventListener("click", () => {
  input.value = FAIR_SAMPLE;
  render();
});
$<HTMLButtonElement>("clear").addEventListener("click", () => {
  input.value = "";
  render();
  input.focus();
});

input.value = TOXIC_SAMPLE;
render();
