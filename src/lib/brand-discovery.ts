export interface DiscoverableBrand { slug: string; search: string; categories: readonly string[] }

export function matchesBrand(brand: DiscoverableBrand, category: string, query: string): boolean {
  const tokens = query.normalize("NFKC").trim().toLocaleLowerCase().split(/\s+/).filter(Boolean);
  const haystack = brand.search.normalize("NFKC").toLocaleLowerCase();
  return (!category || brand.categories.includes(category)) && tokens.every(token => haystack.includes(token));
}
