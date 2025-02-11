import { createLogger, transports, format, Logger } from 'winston';
import { appConfig } from '../config/app-config';
import { NodeEnvironment } from '../types';
import { checkNodeEnvironment } from './environment-check';

const { combine, timestamp, printf } = format;

/**
 * Custom log format for error messages.
 * Includes timestamp, log level, and message for consistent formatting.
 */
const errorFormat = printf(({ level, message, timestamp }) => {
    return `${timestamp} ${level}: ${message}`;
});

// Create a new winston logger instance
const winstonLogger: Logger = createLogger({
    level: 'info', // error: 0, warn: 1, info: 2 will be printed.
    format: combine(timestamp({ format: 'HH:mm:ss' }), errorFormat),
    transports: [
        new transports.Console(),
        new transports.File({ filename: appConfig.LOG_FILE_PATH, level: 'info' }),
    ],
});

/**
 * Logs an error message along with the stack trace.
 * This function is only triggered if the environment is not 'test'.
 *
 * @param {Error} err - The error object that needs to be logged.
 */
export const winstonLogError = (err: Error): void => {
    if (!checkNodeEnvironment(NodeEnvironment.TEST)) winstonLogger.error(`💥 ${err}\n${err.stack}`);
};
