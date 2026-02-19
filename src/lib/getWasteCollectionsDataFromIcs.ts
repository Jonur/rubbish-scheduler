import ical from "ical";

import dayjs from "./dayjs";
import type { WasteCollectionScrappedData } from "../types";
import isIcsVEvent from "./isIcsVEvent";
import normalizeTitle from "./normaliseTitle";
import toHttpUrl from "./toHttpUrl";

const getWasteCollectionsDataFromIcs = async (webcalUrl: string): Promise<WasteCollectionScrappedData[]> => {
  const url = toHttpUrl(webcalUrl);

  const response = await fetch(url, {
    headers: {
      "Accept-Language": "en-GB,en;q=0.9",
      Accept: "text/calendar,*/*;q=0.9",
    },
  });

  if (!response.ok) {
    throw new Error(`[ics] HTTP ${response.status} at ${url}`);
  }

  const icsString = await response.text();
  const parsed = ical.parseICS(icsString);

  const now = dayjs().tz("Europe/London");

  // Dedupe: some feeds can contain duplicates or recurrences expanded strangely.
  const seen = new Set<string>();

  const results: WasteCollectionScrappedData[] = [];

  for (const value of Object.values(parsed)) {
    if (!isIcsVEvent(value)) continue;

    const rawSummary = (value.summary ?? "").trim();
    const start = value.start;

    if (!rawSummary || !start) continue;

    const title = normalizeTitle(rawSummary);

    const startDay = dayjs(start).tz("Europe/London");
    if (startDay.isBefore(now, "day")) continue;

    const nextCollectionDate = startDay.format("D MMMM YYYY");
    const dedupeKey = `${title}__${nextCollectionDate}`;

    if (seen.has(dedupeKey)) continue;
    seen.add(dedupeKey);

    results.push({ title, nextCollectionDate });
  }

  // Helpful for downstream logic + stable tests
  results.sort((a, b) => {
    const aDate = dayjs(a.nextCollectionDate, "D MMMM YYYY", "en", true);
    const bDate = dayjs(b.nextCollectionDate, "D MMMM YYYY", "en", true);

    if (aDate.isBefore(bDate)) return -1;
    if (aDate.isAfter(bDate)) return 1;

    return a.title.localeCompare(b.title);
  });

  return results;
};

export default getWasteCollectionsDataFromIcs;
