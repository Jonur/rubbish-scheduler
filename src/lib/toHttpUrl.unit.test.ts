import toHttpUrl from "./toHttpUrl";

describe("toHttpUrl", () => {
  const mockedUrl = "webcal://example.com/1928731/cal.ics";

  it("should replace the Webcal protocol in the provided URL with HTTPS", () => {
    const result = toHttpUrl(mockedUrl);
    expect(result).toBe("https://example.com/1928731/cal.ics");
  });
});
