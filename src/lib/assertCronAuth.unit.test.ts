import type { VercelRequest } from "@vercel/node";

import assertCronAuth from "./assertCronAuth";
import * as config from "../config";

describe("assertCronAuth", () => {
  vi.mock("../config");
  const mockedConfig = vi.mocked(config);

  const getMockedRequest = (overrides: Partial<VercelRequest> = {}): VercelRequest =>
    ({
      ...overrides,
    }) as VercelRequest;

  describe("when there is no cron secret set", () => {
    it("should immediately return", () => {
      mockedConfig.CRON_SECRET = "";

      const result = assertCronAuth(getMockedRequest());
      expect(result).toBeUndefined();
    });
  });

  describe("when there is a cron secret set", () => {
    beforeEach(() => {
      mockedConfig.CRON_SECRET = "MOCKED-CRON-SECRET";
    });

    it("should throw when there is no provided request", () => {
      expect(() => assertCronAuth(undefined as unknown as VercelRequest)).toThrowError("Unauthorised");
    });

    it("should throw when the request has no headers", () => {
      expect(() => assertCronAuth(getMockedRequest())).toThrowError("Unauthorised");
    });

    it("should throw when the request has no Authorisation headers", () => {
      expect(() => assertCronAuth(getMockedRequest({ headers: {} }))).toThrowError("Unauthorised");
    });

    it("should throw when the headers do not provide a valid token", () => {
      expect(() => assertCronAuth(getMockedRequest({ headers: { authorization: "Test" } }))).toThrowError(
        "Unauthorised"
      );
    });

    it("should throw when the headers do not provide a valid Bearer token", () => {
      expect(() => assertCronAuth(getMockedRequest({ headers: { authorization: "Bearer mimi" } }))).toThrowError(
        "Unauthorised"
      );
    });

    it("should return when the token provided is the valid cron secret", () => {
      const result = assertCronAuth(getMockedRequest({ headers: { authorization: `Bearer ${config.CRON_SECRET}` } }));
      expect(result).toBeUndefined();
    });
  });
});
