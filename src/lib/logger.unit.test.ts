import logger from "./logger";

describe("logger", () => {
  it("logs to console.log by default", () => {
    const logSpy = vi.spyOn(console, "log").mockImplementation(() => undefined);

    logger("hello");

    expect(logSpy).toHaveBeenCalledTimes(1);
    expect(logSpy).toHaveBeenCalledWith("hello");

    logSpy.mockRestore();
  });

  it("logs to console.error when type is 'error'", () => {
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => undefined);

    logger("boom", "error");

    expect(errorSpy).toHaveBeenCalledTimes(1);
    expect(errorSpy).toHaveBeenCalledWith("boom");

    errorSpy.mockRestore();
  });

  it("does not call console.error when defaulting to log", () => {
    const logSpy = vi.spyOn(console, "log").mockImplementation(() => undefined);
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => undefined);

    logger("hello");

    expect(logSpy).toHaveBeenCalledTimes(1);
    expect(errorSpy).not.toHaveBeenCalled();

    logSpy.mockRestore();
    errorSpy.mockRestore();
  });
});
