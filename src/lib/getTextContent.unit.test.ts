import getTextContent from "./getTextContent";

describe("getTextContent", () => {
  const createMockedElement = (text: string | null): Element =>
    ({
      textContent: text,
    }) as unknown as Element;

  it("should return the sanitised text contents of the provided elements", () => {
    const result = getTextContent([
      createMockedElement("John"),
      createMockedElement("Doe"),
      createMockedElement(": age 42"),
    ]);

    expect(result).toEqual(["John", "Doe", ": age 42"]);
  });

  it("should return an empty string if an element has no text content", () => {
    const result = getTextContent([
      createMockedElement("John"),
      createMockedElement(null),
      createMockedElement(": age 42"),
    ]);

    expect(result).toEqual(["John", "", ": age 42"]);
  });

  it("should always trim the text content", () => {
    const result = getTextContent([createMockedElement(" John"), createMockedElement("       Doe       ")]);

    expect(result).toEqual(["John", "Doe"]);
  });
});
