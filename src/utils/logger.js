// utils/logger.js
const pino = require( "pino");

const logger = pino({
  transport: {
    target: "pino-pretty", // Pretty print logs (dev only)
    options: {
      colorize: true,
      translateTime: "SYS:standard",
      ignore: "pid,hostname",
    },
  },
  level: process.env.NODE_ENV === "production" ? "info" : "debug",
});

module.exports = logger;
