import extractWasteServiceGridData from "./extractWasteServiceGridData";

describe("extractWasteServiceGridData", () => {
  const createGrid = (title: string | null, detail: string | null): Element =>
    ({
      querySelector: (selector: string) => {
        if (selector === ".waste-service-name") {
          return title !== null ? { textContent: title } : null;
        }

        if (selector === ".waste-service-grid--service-description") {
          return detail !== null ? { textContent: detail } : null;
        }

        return null;
      },
    }) as unknown as Element;

  it("extracts title and normalized detail text", () => {
    const grids = [
      createGrid("Food Waste", " Next   collection   Saturday "),
      createGrid("Garden Waste", " Next collection  Sunday "),
    ];

    expect(extractWasteServiceGridData(grids)).toEqual([
      { title: "Food Waste", detail: "Next collection Saturday" },
      { title: "Garden Waste", detail: "Next collection Sunday" },
    ]);
  });

  it("falls back to empty strings when elements are missing", () => {
    const grids = [createGrid(null, null)];

    expect(extractWasteServiceGridData(grids)).toEqual([{ title: "", detail: "" }]);
  });
});
