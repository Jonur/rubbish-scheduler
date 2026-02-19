import type { IcsVEvent } from "../types";
import isIcsVEvent from "./isIcsVEvent";

describe("isIcsVEvent", () => {
  it("should return true when the provided value is a valid ICS VEvent", () => {
    const mockedEvent: IcsVEvent = {
      type: "VEVENT",
      uid: "1298371",
      summary: "Mickey collection",
    };

    const result = isIcsVEvent(mockedEvent);
    expect(result).toBe(true);
  });

  it("should return false when the provided value is falsy", () => {
    const result = isIcsVEvent(undefined);
    expect(result).toBe(false);
  });

  it("should return false when the provided value is not an object", () => {
    const result = isIcsVEvent("haha");
    expect(result).toBe(false);
  });

  it("should return false when the provided value does not have a `type` property", () => {
    const result = isIcsVEvent({
      uid: "1298371",
      summary: "Mickey collection",
    });
    expect(result).toBe(false);
  });

  it("should return false when the provided value does not have a valid `type` property", () => {
    const result = isIcsVEvent({
      type: "HAHA",
      uid: "1298371",
      summary: "Mickey collection",
    });
    expect(result).toBe(false);
  });
});
