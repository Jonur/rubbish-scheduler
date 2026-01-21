import getErrorMessage from "./getErrorMessage";

describe("getErrorMessage", () => {
  it("should return the error message when it exists", () => {
    const mockedError = new Error();
    mockedError.message = "WW3 is coming!!!";

    const result = getErrorMessage(mockedError);
    expect(result).toBe("WW3 is coming!!!");
  });

  it("should return the default error message when one does not exist in the error provided", () => {
    const result = getErrorMessage({ errorMessage: "Oops! Something went wrong", status: 500 });
    expect(result).toBe("Internal error");
  });
});
