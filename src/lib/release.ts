import { collectStatuses, getBrands, getLogo } from "@/content";
import { evaluateRelease } from "./release-policy";

/**
 * Problems that must be fixed before a release build. Everything shown on the
 * site has to be approved by the content team, and every published brand needs
 * its supplied logo.
 */
export function releaseProblems(): string[] {
  return evaluateRelease(collectStatuses(), getBrands(), (slug) => Boolean(getLogo(slug) ?? getLogo(slug, true)));
}

export function assertReleasable(): void {
  const problems = releaseProblems();
  if (problems.length) {
    throw new Error(
      `Release build blocked: ${problems.length} item(s) are not approved.\n` +
        problems.map((p) => `  - ${p}`).join("\n") +
        "\nBuild without SITE_RELEASE=1 for a preview, or approve the content first.",
    );
  }
}
