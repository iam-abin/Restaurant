import { createLogger, transports, format, Logger } from 'winston';
import { appConfig } from '../config/app.config';

const { combine, timestamp, printf } = format;

const errorFormat = printf(({ level, message, timestamp }) => {
    return `${timestamp} ${level}: ${message}`;
});

const winstonLogger: Logger = createLogger({
    level: 'info', // error: 0, warn: 1, info: 2 will be printed.
    format: combine(timestamp({ format: 'HH:mm:ss' }), errorFormat),
    transports: [
        new transports.Console(),
        new transports.File({ filename: appConfig.LOG_FILE_PATH, level: 'info' }),
    ],
});

export const winstonLogError = (err: Error): void => {
    if (appConfig.NODE_ENVIRONMENT !== 'test') winstonLogger.error(`💥 ${err}\n${err.stack}`);
};
