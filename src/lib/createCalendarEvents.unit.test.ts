import type { WasteCollectionScrappedData } from "../types";
import createCalendarEvents from "./createCalendarEvents";

describe("createCalendarEvents", () => {
  const mockedWasteCollectionData: WasteCollectionScrappedData[] = [
    {
      nextCollectionDate: "25 January 2026",
      title: "Paper & Cardboard & Food Waste",
    },
    {
      nextCollectionDate: "18 January 2026",
      title: "Food Waste & Mixed Recycling",
    },
    {
      nextCollectionDate: "30 January 2026",
      title: "Garden Waste",
    },
  ];

  it("should create 3 valid Google Calendar events sorted by date", () => {
    const result = createCalendarEvents(mockedWasteCollectionData);
    expect(result).toEqual([
      {
        colorId: "6",
        description: "Waste collection of Food Waste & Mixed Recycling",
        end: {
          dateTime: "2026-01-18T10:00:00Z",
          timeZone: "Europe/London",
        },
        location: "Quernmore Cl, Bromley BR1 4EL",
        start: {
          dateTime: "2026-01-18T08:00:00Z",
          timeZone: "Europe/London",
        },
        summary: "Food Waste & Mixed Recycling",
      },
      {
        colorId: "6",
        description: "Waste collection of Paper & Cardboard & Food Waste",
        end: {
          dateTime: "2026-01-25T10:00:00Z",
          timeZone: "Europe/London",
        },
        location: "Quernmore Cl, Bromley BR1 4EL",
        start: {
          dateTime: "2026-01-25T08:00:00Z",
          timeZone: "Europe/London",
        },
        summary: "Paper & Cardboard & Food Waste",
      },
      {
        colorId: "6",
        description: "Waste collection of Garden Waste",
        end: {
          dateTime: "2026-01-30T10:00:00Z",
          timeZone: "Europe/London",
        },
        location: "Quernmore Cl, Bromley BR1 4EL",
        start: {
          dateTime: "2026-01-30T08:00:00Z",
          timeZone: "Europe/London",
        },
        summary: "Garden Waste",
      },
    ]);
  });

  it("should return an empty array for empty input", () => {
    const result = createCalendarEvents();
    expect(result).toEqual([]);
  });
});
