const winston = require('winston');
const os = require('os');
const process = require('process');
const fs = require('fs'); // Added for directory creation

const levelMap = {
    error: 50,
    warn: 40,
    info: 30,
    http: 20,
    debug: 10,
};

const logger = winston.createLogger({
    level: 'info',
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
                    ...meta,
                    msg: message || 'An error occurred',
                    stack: stack || undefined,
                },
                null,
                2
            );
        })
    ),
    transports: [],
});

// Conditionally add transports based on environment
if (process.env.VERCEL) {
    // On Vercel, use Console transport only
    logger.add(
        new winston.transports.Console({
            format: winston.format.simple(), // Simplify for Vercel logs
        })
    );
} else {
    // Locally, use File transport and ensure logs directory exists
    const logDir = 'logs';
    if (!fs.existsSync(logDir)) {
        fs.mkdirSync(logDir);
    }
    logger.add(
        new winston.transports.File({ filename: 'logs/app.log' })
    );
    logger.add(
        new winston.transports.Console() // Optional: Keep Console for local dev
    );
}

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
        logger.error('An error occurred', {
            ...metadata,
            error: error,
        });
    }
};

logger.Info = (message, metadata = {}) => {
    logger.info(message, {
        ...metadata,
    });
};

module.exports = logger;