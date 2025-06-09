const winston = require("winston");
const os = require("os");
const process = require("process");

const levelMap = {
    error: 50,
    warn: 40,
    info: 30,
    http: 20,
    debug: 10,
};

const logger = winston.createLogger({
    level: "info",
    format: winston.format.combine(
        winston.format.timestamp({ format: () => new Date().toISOString() }),
        winston.format.printf(({ level, timestamp, message, stack, ...meta }) => {
            return JSON.stringify(
                {
                    level: levelMap[level] || 30,
                    log: level,
                    time: timestamp,
                    pid: process.pid,
                    hostname: os.hostname(),
                    ...meta, // Include additional metadata
                    msg: message || "An error occurred",
                    stack: stack || undefined, // Auto-include stack trace
                },
                null,
                2
            );
        })
    ),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: "logs/app.log" }),
    ],
});

/**
 * Custom logger method to handle error objects properly
 */
logger.Error = (error, metadata = {}) => {
    if (error instanceof Error) {
        logger.error(error.message, {
            ...metadata,
            stack: error.stack,
        });
    } else {
        logger.error("An error occurred", {
            ...metadata,
            error: error, // Log non-error objects as-is
        });
    }
};

logger.Info = (message, metadata = {}) => {
    logger.info(message, {
        ...metadata,
    });
};

module.exports = logger;
