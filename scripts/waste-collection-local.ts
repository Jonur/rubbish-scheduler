import "dotenv/config";

import getErrorMessage from "../src/lib/getErrorMessage";
import runWasteCollectionSync from "../src/lib/runWasteCollectionSync";

(async () => {
  const result = await runWasteCollectionSync();
  console.log("✅ All events created!", result);
})().catch((err: Error) => {
  console.error("❌ Run failed:", getErrorMessage(err));
  process.exitCode = 1;
});
