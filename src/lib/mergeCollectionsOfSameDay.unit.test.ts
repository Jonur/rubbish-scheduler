import type { WasteCollectionScrappedData } from "../types";
import mergeCollectionsOfSameDay from "./mergeCollectionsOfSameDay";

describe("mergeCollectionsOfSameDay", () => {
  const mockedScrappedData: WasteCollectionScrappedData[] = [
    {
      title: "Food Waste",
      nextCollectionDate: "18 January 2026",
    },
    {
      title: "Mixed Recycling",
      nextCollectionDate: "18 January 2026",
    },
    {
      title: "Paper & Cardboard",
      nextCollectionDate: "25 January 2026",
    },
    {
      title: "Food Waste",
      nextCollectionDate: "25 January 2026",
    },
    {
      title: "Garden Waste",
      nextCollectionDate: "30 January 2026",
    },
  ];

  it("should merge the waste collections of the same day into single day events", () => {
    const result = mergeCollectionsOfSameDay(mockedScrappedData);
    expect(result).toEqual([
      {
        nextCollectionDate: "18 January 2026",
        title: "Food Waste & Mixed Recycling",
      },
      {
        nextCollectionDate: "25 January 2026",
        title: "Paper & Cardboard & Food Waste",
      },
      {
        nextCollectionDate: "30 January 2026",
        title: "Garden Waste",
      },
    ]);
  });

  it("should return an empty array for empty input", () => {
    const result = mergeCollectionsOfSameDay();
    expect(result).toEqual([]);
  });
});
