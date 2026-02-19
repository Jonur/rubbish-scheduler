import type { IcsVEvent } from "../types";

const isIcsVEvent = (value: unknown): value is IcsVEvent =>
  Boolean(value) && typeof value === "object" && value !== null && "type" in value && value.type === "VEVENT";

export default isIcsVEvent;
