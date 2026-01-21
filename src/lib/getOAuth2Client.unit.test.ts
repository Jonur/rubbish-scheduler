import { google } from "googleapis";

import getOAuth2Client from "./getOAuth2Client";

describe("getOAuth2Client", () => {
  it("should return a JWT client", () => {
    const result = getOAuth2Client();
    expect(result).toBeInstanceOf(google.auth.JWT);
  });

  it("returns a singleton instance", () => {
    const a = getOAuth2Client();
    const b = getOAuth2Client();
    expect(a).toEqual(b);
  });
});
