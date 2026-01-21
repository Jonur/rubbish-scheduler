import getErrorStatusCode from "./getErrorStatusCode";

describe("getErrorStatusCode", () => {
  it("should return the status code found in the provided Error", () => {
    const mockedError = new Error();
    Object.assign(mockedError, { statusCode: 404 });

    const result = getErrorStatusCode(mockedError);
    expect(result).toBe(404);
  });

  it("should return the default status code if a valid Error not provided", () => {
    const result = getErrorStatusCode({ statusCode: 403 });
    expect(result).toBe(500);
  });

  it("should return the default status code if one does not exist in the provided Error", () => {
    const mockedError = new Error();
    const result = getErrorStatusCode(mockedError);
    expect(result).toBe(500);
  });

  it("should return the provided default status code if a valid Error not provided", () => {
    const result = getErrorStatusCode({ statusCode: 403 }, 404);
    expect(result).toBe(404);
  });
});
