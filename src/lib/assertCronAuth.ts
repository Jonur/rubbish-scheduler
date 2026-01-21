import type { VercelRequest } from "@vercel/node";

import { CRON_SECRET } from "../config";
import { UnauthorizedError } from "../types";

const assertCronAuth = (req: VercelRequest) => {
  if (!CRON_SECRET) return;

  const authHeader = req?.headers?.authorization || req?.headers?.Authorization || "";
  const token = typeof authHeader === "string" && authHeader.startsWith("Bearer ") ? authHeader.slice(7) : authHeader;

  if (token !== CRON_SECRET) {
    throw new UnauthorizedError("Unauthorised");
  }
};

export default assertCronAuth;
