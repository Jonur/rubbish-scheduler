import type { VercelRequest, VercelResponse } from "@vercel/node";

import assertCronAuth from "../src/lib/assertCronAuth";
import getErrorMessage from "../src/lib/getErrorMessage";
import getErrorStatusCode from "../src/lib/getErrorStatusCode";
import runWasteCollectionSync from "../src/lib/runWasteCollectionSync";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    assertCronAuth(req);
    await runWasteCollectionSync();
    res.status(200).send("All events created!");
  } catch (error) {
    console.error(error);

    const status = getErrorStatusCode(error);

    res.status(status).send(getErrorMessage(error));
  }
}
