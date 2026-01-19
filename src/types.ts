import type { calendar_v3 } from "googleapis";

export type WasteCollectionScrappedData = {
  title: string;
  nextCollectionDate: string;
};

export type CalendarEvent = {
  colorId: string;
  description: string;
  end: {
    dateTime: string;
    timeZone: string;
  };
  location: string;
  start: {
    dateTime: string;
    timeZone: string;
  };
  summary: string;
};

export type EventsListResponse = Awaited<ReturnType<calendar_v3.Calendar["events"]["list"]>>;

export class UnauthorizedError extends Error {
  statusCode = 401;
}
