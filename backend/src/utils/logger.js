const format = (level, message) => `[${new Date().toISOString()}] ${level.toUpperCase()}: ${message}`;

module.exports = {
  info(message) {
    console.log(format("info", message));
  },
  warn(message) {
    console.warn(format("warn", message));
  },
  error(message) {
    console.error(format("error", message));
  }
};

