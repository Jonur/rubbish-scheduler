const getErrorMessage = (error: unknown) => (error instanceof Error ? error.message : "Internal error");

export default getErrorMessage;
