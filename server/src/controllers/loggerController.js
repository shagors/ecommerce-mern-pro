const { createLogger, format, transports } = require("winston");

const logger = createLogger({
  level: "info",
  format: format.combine(
    format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    format.json()
  ),
  transports: [
    new transports.File({
      filename: "src/logs/info.log",
      level: "info",
      maxsize: 5242880,
      maxFiles: 5,
    }),
    new transports.File({
      filename: "src/logs/error.log",
      level: "error",
      maxsize: 5242880,
      maxFiles: 5,
    }),
    // new transports.Console({
    //   format: format.combine(format.colorize(), format.simple()),
    // }),
  ],
});

module.exports = logger;
