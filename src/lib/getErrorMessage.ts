const getErrorMessage = (error: unknown) =>
  error instanceof Error && "message" in error ? error.message : "Internal error";

export default getErrorMessage;
