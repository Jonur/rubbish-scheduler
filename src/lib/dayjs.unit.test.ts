import dayjs from "./dayjs";

describe("dayjs wrapper", () => {
  it("supports UTC parsing/formatting", () => {
    expect(dayjs.utc("2025-01-01T00:00:00Z").toISOString()).toBe("2025-01-01T00:00:00.000Z");
  });

  it("supports timezone conversion (winter: Europe/London is UTC+0)", () => {
    const d = dayjs("2025-01-01T12:00:00Z").tz("Europe/London");
    // Same instant; formatted local time should still be 12:00 in winter
    expect(d.format("YYYY-MM-DD HH:mm")).toBe("2025-01-01 12:00");
  });

  it("supports timezone conversion (summer: Europe/London is UTC+1)", () => {
    const d = dayjs("2025-07-01T12:00:00Z").tz("Europe/London");
    // In summer London is BST (UTC+1), so local time should be 13:00
    expect(d.format("YYYY-MM-DD HH:mm")).toBe("2025-07-01 13:00");
  });

  it("supports custom parse formats", () => {
    const d = dayjs("03-01-2025", "DD-MM-YYYY", true);
    expect(d.isValid()).toBe(true);
    expect(d.format("YYYY-MM-DD")).toBe("2025-01-03");
  });
});
