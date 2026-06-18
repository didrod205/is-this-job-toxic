import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { analyze } from "../src/analyze.js";

const read = (f: string) => readFileSync(resolve(__dirname, "..", "examples", f), "utf8");

describe("red-flag detection", () => {
  it("flags 'we're a family' as culture", () => {
    const r = analyze("We're a family here.");
    expect(r.findings.some((f) => f.match.toLowerCase() === "we're a family" && f.category === "culture")).toBe(true);
  });

  it("decodes 'competitive salary'", () => {
    const r = analyze("We offer a competitive salary.");
    const f = r.findings.find((x) => x.match.toLowerCase() === "competitive salary");
    expect(f?.category).toBe("comp");
    expect(f?.decode).toMatch(/number/i);
  });

  it("matches hyphenated phrases like fast-paced", () => {
    const r = analyze("A fast-paced environment.");
    expect(r.findings.some((f) => f.match.toLowerCase() === "fast-paced")).toBe(true);
  });

  it("does not match inside larger words", () => {
    // 'guru' should not fire inside 'gurus' boundary? it should — but not in 'figured'
    const r = analyze("We figured it out. The configuration is done.");
    expect(r.findings.length).toBe(0);
  });

  it("prefers the longer overlapping phrase (rockstars only > rockstar)", () => {
    const r = analyze("Rockstars only need apply.");
    const matches = r.findings.map((f) => f.match.toLowerCase());
    expect(matches).toContain("rockstars only");
    expect(matches).not.toContain("rockstar");
  });

  it("prefers 'fast-paced startup' over 'fast-paced'", () => {
    const r = analyze("It's a fast-paced startup.");
    const matches = r.findings.map((f) => f.match.toLowerCase());
    expect(matches).toContain("fast-paced startup");
    expect(matches).not.toContain("fast-paced");
  });

  it("counts repeats in topFlags", () => {
    const r = analyze("fast-paced and fast-paced and fast-paced");
    const top = r.topFlags.find((t) => t.match.toLowerCase() === "fast-paced");
    expect(top?.count).toBe(3);
  });

  it("respects ignored categories", () => {
    const r = analyze("competitive salary, we're a family", { ignore: ["comp"] });
    const matches = r.findings.map((f) => f.match.toLowerCase());
    expect(matches).not.toContain("competitive salary");
    expect(matches).toContain("we're a family");
  });

  it("produces non-overlapping, ordered spans", () => {
    const r = analyze(read("toxic.txt"));
    for (let i = 1; i < r.findings.length; i++) {
      expect(r.findings[i]!.start).toBeGreaterThanOrEqual(r.findings[i - 1]!.end);
    }
  });
});

describe("calibration", () => {
  it("a stuffed posting scores toxic (run)", () => {
    const r = analyze(read("toxic.txt"));
    expect(r.verdict.score).toBeGreaterThanOrEqual(70);
    expect(r.verdict.band).toBe("run");
  });

  it("a clear, fair posting scores healthy", () => {
    const r = analyze(read("healthy.txt"));
    expect(r.verdict.score).toBeLessThan(20);
    expect(r.verdict.band).toBe("healthy");
  });

  it("empty text is healthy with no findings", () => {
    const r = analyze("");
    expect(r.findings).toHaveLength(0);
    expect(r.verdict.score).toBe(0);
  });
});
