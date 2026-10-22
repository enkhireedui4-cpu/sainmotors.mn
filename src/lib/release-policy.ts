import type { ContentStatus } from "../content/types";

/** Pure policy shared by Next rendering and the pre-build/packaging CLI. */
export function evaluateRelease(
  records: { path: string; status: ContentStatus }[],
  brands: { slug: string }[],
  usableLogo: (slug: string) => boolean,
): string[] {
  const problems = records.filter((item) => item.status !== "approved")
    .map((item) => `${item.path}: ${item.status}`);
  for (const brand of brands) {
    if (!usableLogo(brand.slug)) problems.push(`brands.${brand.slug}: logo missing`);
  }
  return problems;
}
