import type { VercelRequest, VercelResponse } from "@vercel/node";

import handler from "./waste-collection";
import assertCronAuth from "../src/lib/assertCronAuth";
import getErrorMessage from "../src/lib/getErrorMessage";
import getErrorStatusCode from "../src/lib/getErrorStatusCode";
import runWasteCollectionSync from "../src/lib/runWasteCollectionSync";

describe("api/waste-collection handler", () => {
  vi.mock("../src/lib/assertCronAuth");
  vi.mock("../src/lib/runWasteCollectionSync");
  vi.mock("../src/lib/getErrorStatusCode");
  vi.mock("../src/lib/getErrorMessage");

  const createRes = () => {
    const status = vi.fn();
    const send = vi.fn();

    status.mockReturnValue({ send });

    return { res: { status, send } as unknown as VercelResponse, status, send };
  };

  it("responds with 200 when auth passes and sync succeeds", async () => {
    vi.mocked(assertCronAuth).mockImplementation(() => undefined);
    vi.mocked(runWasteCollectionSync).mockResolvedValue({ created: 2, deleted: 3 });

    const req = {} as VercelRequest;
    const { res, status, send } = createRes();

    await handler(req, res);

    expect(assertCronAuth).toHaveBeenCalledTimes(1);
    expect(assertCronAuth).toHaveBeenCalledWith(req);

    expect(runWasteCollectionSync).toHaveBeenCalledTimes(1);

    expect(status).toHaveBeenCalledWith(200);
    expect(send).toHaveBeenCalledWith("All events created!");
  });

  it("responds with derived status + message when an error is thrown", async () => {
    const error = new Error("nope");

    vi.mocked(assertCronAuth).mockImplementation(() => {
      throw error;
    });

    vi.mocked(getErrorStatusCode).mockReturnValue(401);
    vi.mocked(getErrorMessage).mockReturnValue("Unauthorized");

    const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => undefined);

    const req = {} as VercelRequest;
    const { res, status, send } = createRes();

    await handler(req, res);

    expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
    expect(consoleErrorSpy).toHaveBeenCalledWith(error);

    expect(getErrorStatusCode).toHaveBeenCalledTimes(1);
    expect(getErrorStatusCode).toHaveBeenCalledWith(error);

    expect(getErrorMessage).toHaveBeenCalledTimes(1);
    expect(getErrorMessage).toHaveBeenCalledWith(error);

    expect(status).toHaveBeenCalledWith(401);
    expect(send).toHaveBeenCalledWith("Unauthorized");

    consoleErrorSpy.mockRestore();
  });
});
