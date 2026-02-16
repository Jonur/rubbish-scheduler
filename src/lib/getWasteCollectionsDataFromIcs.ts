import ical from "ical";

import dayjs from "./dayjs";
import type { WasteCollectionScrappedData } from "../types";

const toHttpUrl = (webcalUrl: string) => webcalUrl.replace(/^webcal:\/\//, "https://");

const getWasteCollectionsDataFromIcs = async (webcalUrl: string): Promise<WasteCollectionScrappedData[]> => {
  const url = toHttpUrl(webcalUrl);

  // 1️⃣ Fetch the ICS file
  const response = await fetch(url, {
    headers: {
      "Accept-Language": "en-GB,en;q=0.9",
      Accept: "text/calendar,*/*;q=0.9",
    },
  });

  if (!response.ok) {
    throw new Error(`[ics] HTTP ${response.status} at ${url}`);
  }

  // 2️⃣ Get raw text
  const icsString = await response.text();

  // 3️⃣ Parse ICS
  const parsed = ical.parseICS(icsString);

  const now = dayjs();
  const nextByTitle = new Map<string, Date>();

  for (const value of Object.values(parsed)) {
    if ((value as any).type !== "VEVENT") continue;

    const summary = ((value as any).summary ?? "").trim();
    const start = (value as any).start as Date | undefined;

    if (!summary || !start) continue;

    const startDay = dayjs(start).tz("Europe/London");

    if (startDay.isBefore(now, "day")) continue;

    const existing = nextByTitle.get(summary);
    if (!existing || startDay.isBefore(dayjs(existing), "day")) {
      nextByTitle.set(summary, start);
    }
  }

  return [...nextByTitle.entries()].map(([title, date]) => ({
    title,
    nextCollectionDate: dayjs(date).tz("Europe/London").format("D MMMM YYYY"),
  }));
};

export default getWasteCollectionsDataFromIcs;
