import { describe, expect, it, vi, afterEach } from "vitest";
import { execFileSync } from "node:child_process";
import { existsSync, mkdtempSync, readFileSync, rmSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { collectStatuses, company, getBrands, hero } from "@/content";

afterEach(() => { vi.unstubAllEnvs(); vi.resetModules(); });

describe("publication review registry", () => {
  it("exports every nested status to the same review CSV without inventing an owner or approver", () => {
    const dir = mkdtempSync(path.join(os.tmpdir(), "sain-review-"));
    const output = path.join(dir, "checklist.csv");
    try {
      execFileSync(process.execPath, ["scripts/content-checklist.mjs", "--output", output]);
      expect(existsSync(output), "CLI writes the requested review artifact").toBe(true);
      const csv = readFileSync(output, "utf8");
      for (const entry of collectStatuses()) expect(csv, entry.path).toContain(`"${entry.path}"`);
      expect(csv).toContain('"homeDiscover"');
      expect(csv).toContain('"brands[0].teaser"');
      expect(csv).toContain('"brands[0].cardCopy"');
      expect(csv).toMatch(/"brands\[3\]\.gallery\[0\]"/);
      expect(csv).toContain('"Owner","Approver"');
      expect(csv).not.toContain("Энх-Ирээдүй (вэб)");
      expect(csv.charCodeAt(0)).toBe(0xfeff);
    } finally { rmSync(dir, { recursive: true, force: true }); }
  });

  it("approves only the user-confirmed eleven-brand fact while preserving unrelated review states", () => {
    expect(hero.kicker.status).toBe("approved");
    expect(hero.kicker.value.en).toBe("Official distributor of 11 brands");
    expect(company.distributorClaim.value.en).toBe("Sain Motors is the official distributor of 11 automotive brands in Mongolia.");
    expect(company.introduction.value.en).toContain("SOUEAST");
    expect(company.introduction.status).not.toBe("approved");
    expect(getBrands().every((brand) => brand.summary.status !== "approved")).toBe(true);
  });
});

describe("preview indexing", () => {
  it.each([
    [undefined, undefined, false],
    ["0", "https://sainmotors.mn", false],
    ["1", "https://staging.sainmotors.mn", false],
    ["1", "https://sainmotors.mn/", true],
  ])("release=%s origin=%s permits indexing=%s", async (release, origin, indexable) => {
    vi.stubEnv("SITE_RELEASE", release);
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", origin);
    const { default: robots } = await import("@/app/robots");
    const result = robots();
    expect(result.rules).toEqual(indexable ? { userAgent: "*", allow: "/" } : { userAgent: "*", disallow: "/" });
    expect(Boolean(result.sitemap)).toBe(indexable);
  });
});

