type WasteServiceGridItem = {
  title: string;
  detail: string;
};

const extractWasteServiceGridData = (grids: Element[]): WasteServiceGridItem[] =>
  grids.map((grid) => {
    const title = grid.querySelector(".waste-service-name")?.textContent?.trim() ?? "";
    const detail =
      grid.querySelector(".waste-service-grid--service-description")?.textContent?.replace(/\s+/g, " ").trim() ?? "";

    return { title, detail };
  });

export default extractWasteServiceGridData;
