import { extractNextCollectionDate, extractNextCollectionText } from "./extractNextCollectionDate";

describe("extractNextCollectionText", () => {
  it("returns empty string by default", () => {
    expect(extractNextCollectionText()).toBe("");
  });

  it("returns empty string when there is no 'Next collection' section", () => {
    const input = "Frequency Every Thursday Last collection Saturday, 27th December";
    expect(extractNextCollectionText(input)).toBe("");
  });

  it("extracts the text after 'Next collection' and trims whitespace", () => {
    const input = `
      Next collection

        Saturday, 3rd January

    `;
    expect(extractNextCollectionText(input)).toBe("Saturday, 3rd January");
  });

  it("stops extraction before 'Last collection' if present", () => {
    const input = `
      Next collection Saturday, 3rd January (adjusted)
      Last collection Saturday, 27th December, at 10:04am
    `;
    expect(extractNextCollectionText(input)).toBe("Saturday, 3rd January (adjusted)");
  });

  it("normalizes excessive whitespace while keeping the content", () => {
    const input = "Next   collection     Saturday,   3rd   January   ";
    expect(extractNextCollectionText(input)).toBe("Saturday, 3rd January");
  });
});

describe("extractNextCollectionDate", () => {
  // ✅ Create all state + mocks in a hoisted-safe way
  const mockState = vi.hoisted(() => {
    let nowYear = 2025;
    let nowMonthIndex = 0; // Jan
    let candidateValid = true;
    let candidateFormatted = "3 January 2025";

    const monthIndexMap: Record<string, number> = {
      January: 0,
      February: 1,
      March: 2,
      April: 3,
      May: 4,
      June: 5,
      July: 6,
      August: 7,
      September: 8,
      October: 9,
      November: 10,
      December: 11,
    };

    const dayjsMock = vi.fn((value?: string) => {
      // dayjs() -> now
      if (typeof value === "undefined") {
        return {
          year: () => nowYear,
          month: () => nowMonthIndex,
        };
      }

      // dayjs(`${monthName} 1`, "MMMM D", "en", true) -> month parser
      if (typeof value === "string" && value.endsWith(" 1")) {
        const monthName = value.replace(" 1", "");
        return {
          month: () => monthIndexMap[monthName] ?? NaN,
        };
      }

      // dayjs(`${day} ${monthName} ${year}`, "D MMMM YYYY", "en", true) -> candidate
      return {
        isValid: () => candidateValid,
        format: () => candidateFormatted,
      };
    });

    return {
      get nowYear() {
        return nowYear;
      },
      set nowYear(v: number) {
        nowYear = v;
      },

      get nowMonthIndex() {
        return nowMonthIndex;
      },
      set nowMonthIndex(v: number) {
        nowMonthIndex = v;
      },

      get candidateValid() {
        return candidateValid;
      },
      set candidateValid(v: boolean) {
        candidateValid = v;
      },

      get candidateFormatted() {
        return candidateFormatted;
      },
      set candidateFormatted(v: string) {
        candidateFormatted = v;
      },

      dayjsMock,
    };
  });

  vi.mock("./dayjs", () => ({
    default: mockState.dayjsMock,
  }));

  beforeEach(() => {
    vi.clearAllMocks();

    mockState.nowYear = 2025;
    mockState.nowMonthIndex = 0;

    mockState.candidateValid = true;
    mockState.candidateFormatted = "3 January 2025";
  });

  it("returns empty string by default", () => {
    expect(extractNextCollectionDate()).toBe("");
  });

  it("returns empty string when Next collection section is missing", () => {
    const input = "Frequency Every Thursday Last collection Saturday, 27th December";
    expect(extractNextCollectionDate(input)).toBe("");
  });

  it("returns empty string when cleaned Next collection text has no month", () => {
    const input = "Next collection Saturday, 3rd (adjusted) Last collection yesterday";
    expect(extractNextCollectionDate(input)).toBe("");
  });

  it("returns empty string when cleaned Next collection text has no day number", () => {
    const input = "Next collection Saturday, January (adjusted)";
    expect(extractNextCollectionDate(input)).toBe("");
  });

  it("returns empty string when parsed day is out of range (0 or >31)", () => {
    expect(extractNextCollectionDate("Next collection Saturday, 0th January")).toBe("");
    expect(extractNextCollectionDate("Next collection Saturday, 32nd January")).toBe("");
  });

  it("strips ordinal suffixes and parentheses before parsing", () => {
    mockState.candidateFormatted = "3 January 2025";

    const input =
      "Next collection Saturday, 3rd January (this collection has been adjusted from its usual time) Last collection ...";

    expect(extractNextCollectionDate(input)).toBe("3 January 2025");
    expect(mockState.dayjsMock).toHaveBeenCalled();
  });

  it("uses the current year when parsed month is not earlier than current month", () => {
    mockState.nowYear = 2025;
    mockState.nowMonthIndex = 5; // June

    mockState.candidateFormatted = "3 July 2025";

    const input = "Next collection Saturday, 3rd July";
    expect(extractNextCollectionDate(input)).toBe("3 July 2025");
  });

  it("uses next year when parsed month is earlier than the current month", () => {
    mockState.nowYear = 2025;
    mockState.nowMonthIndex = 9; // October

    mockState.candidateFormatted = "3 January 2026";

    const input = "Next collection Saturday, 3rd January";
    expect(extractNextCollectionDate(input)).toBe("3 January 2026");
  });

  it("returns empty string if the constructed candidate date is invalid", () => {
    mockState.candidateValid = false;

    const input = "Next collection Saturday, 31st February";
    expect(extractNextCollectionDate(input)).toBe("");
  });
});
