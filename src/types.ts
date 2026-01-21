import type { calendar_v3 } from "googleapis";

export type WasteCollectionScrappedData = {
  title: string;
  nextCollectionDate: string;
};

export type EventsListResponse = Awaited<ReturnType<calendar_v3.Calendar["events"]["list"]>>;

export class UnauthorizedError extends Error {
  statusCode = 401;
}
