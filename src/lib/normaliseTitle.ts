const normalizeTitle = (summary: string) =>
  summary
    .replace(/\s+/g, " ")
    .trim()
    // Bromley tends to include " collection" suffix in the ICS
    .replace(/\s+collection$/i, "")
    .trim();

export default normalizeTitle;
