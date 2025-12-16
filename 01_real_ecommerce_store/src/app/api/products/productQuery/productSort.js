export function sortByRelevance(items, searchTerm) {
  const term = searchTerm.toLowerCase();

  return items.sort((a, b) => {
    // Exact name match = highest priority
    const aExact = a.name.toLowerCase() === term ? 1 : 0;
    const bExact = b.name.toLowerCase() === term ? 1 : 0;
    if (aExact !== bExact) return bExact - aExact;

    // Partial name match = next priority
    const aPartial = a.name.toLowerCase().includes(term) ? 1 : 0;
    const bPartial = b.name.toLowerCase().includes(term) ? 1 : 0;
    if (aPartial !== bPartial) return bPartial - aPartial;

    // Partial description match = next priority
    const aDesc = a.description.toLowerCase().includes(term) ? 1 : 0;
    const bDesc = b.description.toLowerCase().includes(term) ? 1 : 0;
    if (aDesc !== bDesc) return bDesc - aDesc;

    // Optional: fallback = by popularity/sold_count if available
    if (a.sold_count && b.sold_count) return b.sold_count - a.sold_count;

    return 0; // keep original order if tie
  });
}
