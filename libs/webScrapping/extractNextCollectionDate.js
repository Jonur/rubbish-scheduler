const dayjs = require('dayjs');
const customParseFormat = require('dayjs/plugin/customParseFormat');
dayjs.extend(customParseFormat);

const ORDINAL_SUFFIXES_RE = /(\d{1,2})(st|nd|rd|th)/gi;

// We’ll assume UK council pages in English.
const MONTHS_RE = /(January|February|March|April|May|June|July|August|September|October|November|December)/i;

function extractNextCollectionText(detailText = '') {
  // Normalize whitespace while keeping meaningful words.
  const text = detailText.replace(/\s+/g, ' ').trim();

  // Try to capture the “Next collection ...” section only
  // (Stop before “Last collection” if present).
  const nextSection = text.match(/Next collection\s+(.*?)(?:\s+Last collection|$)/i);
  return (nextSection?.[1] || '').trim();
}

function extractNextCollectionDate(detailText = '') {
  const nextText = extractNextCollectionText(detailText);
  if (!nextText) return '';

  // Example: "Saturday, 3rd January (this collection has been adjusted...)"
  // Remove bracketed/parenthetical notes and trim.
  const cleaned = nextText
    .replace(/\(.*?\)/g, ' ')
    .replace(ORDINAL_SUFFIXES_RE, '$1')
    .replace(/\s+/g, ' ')
    .trim();

  // We expect at least "3 January" somewhere in there.
  const monthMatch = cleaned.match(MONTHS_RE);
  const dayMatch = cleaned.match(/\b(\d{1,2})\b/);

  if (!monthMatch || !dayMatch) return '';

  const day = Number(dayMatch[1]);
  const monthName = monthMatch[1];

  if (!(day >= 1 && day <= 31)) return '';

  const now = dayjs();
  const currentYear = now.year();

  // Choose year: if month is earlier than current month, assume next year.
  const currentMonthIndex = now.month(); // 0-11
  const parsedMonthIndex = dayjs(`${monthName} 1`, 'MMMM D', 'en', true).month();

  const year = parsedMonthIndex < currentMonthIndex ? currentYear + 1 : currentYear;

  // Build a real date and validate
  const candidate = dayjs(`${day} ${monthName} ${year}`, 'D MMMM YYYY', 'en', true);
  return candidate.isValid() ? candidate.format('D MMMM YYYY') : '';
}

module.exports = {
  extractNextCollectionDate,
  extractNextCollectionText,
};
