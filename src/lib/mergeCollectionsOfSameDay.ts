import type { WasteCollectionScrappedData } from "../types";

const mergeCollectionsOfSameDay = (wasteCollectionsData: WasteCollectionScrappedData[] = []) =>
  wasteCollectionsData.reduce<WasteCollectionScrappedData[]>((acc, collection) => {
    const idx = acc.findIndex((c) => c.nextCollectionDate === collection.nextCollectionDate);
    if (idx > -1) {
      acc[idx].title = `${acc[idx].title} & ${collection.title}`;
      return acc;
    }
    return [...acc, collection];
  }, []);

export default mergeCollectionsOfSameDay;
