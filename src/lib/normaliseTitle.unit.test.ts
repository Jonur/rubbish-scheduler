import normaliseTitle from "./normaliseTitle";

describe("normaliseTitle", () => {
  const mockedTitle = "  All the    bins collection ";

  it("should normalise the provided event title", () => {
    const result = normaliseTitle(mockedTitle);
    expect(result).toBe("All the bins");
  });
});
