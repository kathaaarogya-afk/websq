export interface InternalLinkCandidate {
  _id: string;
  title: string;
  slug: string;
  category: string;
  excerpt?: string;
  coverImage?: string;
}

function terms(text: string): Set<string> {
  return new Set(
    text
      .toLowerCase()
      .split(/[^a-z0-9]+/)
      .filter((w) => w.length > 3)
  );
}

export function pickInternalLinks(
  current: { title: string; slug: string; category: string },
  candidates: InternalLinkCandidate[],
  max = 3
): InternalLinkCandidate[] {
  const currentTerms = terms(current.title);

  return candidates
    .filter((c) => c.slug && c.slug !== current.slug)
    .map((c) => {
      let score = 0;
      if (c.category === current.category) score += 10;

      let overlap = 0;
      for (const t of terms(c.title)) {
        if (currentTerms.has(t)) overlap += 1;
      }
      score += overlap * 3;

      return { c, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, max)
    .map((x) => x.c);
}