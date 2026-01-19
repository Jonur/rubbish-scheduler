const getErrorStatusCode = (error: unknown, defaultCode = 500) =>
  error instanceof Error && "statusCode" in error
    ? ((error as { statusCode?: number }).statusCode ?? defaultCode)
    : defaultCode;

export default getErrorStatusCode;
