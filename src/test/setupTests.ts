import { afterEach, vi } from "vitest";
import "dotenv/config";

// Optional but useful for consistent date behaviour
process.env.TZ = "Europe/London";

afterEach(() => {
  vi.restoreAllMocks();
});
