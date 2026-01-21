const getErrorStatusCode = (error: unknown, defaultCode = 500) =>
  error instanceof Error && "statusCode" in error && typeof error.statusCode === "number"
    ? error.statusCode || defaultCode
    : defaultCode;

export default getErrorStatusCode;
