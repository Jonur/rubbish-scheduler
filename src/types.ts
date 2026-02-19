import type { calendar_v3 } from "googleapis";

export type WasteCollectionScrappedData = {
  title: string;
  nextCollectionDate: string;
};

export type EventsListResponse = Awaited<ReturnType<calendar_v3.Calendar["events"]["list"]>>;

export class UnauthorizedError extends Error {
  statusCode = 401;
}

export type IcsVEvent = {
  type: "VEVENT";
  summary?: string;
  start?: Date;
  end?: Date;
  uid?: string;
  description?: string;
  dtstamp?: Date;
  params?: unknown[];
};
