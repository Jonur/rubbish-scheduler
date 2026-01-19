const logger = (message: string, type: "log" | "error" = "log") => {
  console[type](message);
};

export default logger;
