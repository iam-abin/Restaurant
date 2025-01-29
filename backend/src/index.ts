import dotenv from 'dotenv';

// Load different .env files based on NODE_ENV
if (process.env.NODE_ENV === 'production') {
    dotenv.config({ path: '.env.production' });
} else {
    dotenv.config({ path: '.env.development' });
}

import { appConfig } from './config/app.config';
import { app } from './app';
import { connectDb } from './config/db.connection';
import { winstonLogError } from './utils';
import { IAppConfig } from './types';

// Environment validation at startup
const REQUIRED_ENV_VARIABLES = Object.keys(appConfig) as (keyof IAppConfig)[];
const missingEnvVariables: string[] = REQUIRED_ENV_VARIABLES.filter((key: keyof IAppConfig) => {
    const value: string | number | string[] = appConfig[key];
    // Check if the variable is missing or if it's an array with length 0
    return !value || (Array.isArray(value) && !value.length);
});

if (missingEnvVariables.length) {
    // eslint-disable-next-line no-console
    console.error(
        `🚨 Missing the following required environment variable${missingEnvVariables.length === 1 ? '' : 's'}: ` +
            `${missingEnvVariables.map((variable) => `"${variable}"`).join(', ')} `,
    );
    process.exit(1);
}

const PORT: number = appConfig.PORT;
(async () => {
    await connectDb();
    app.listen(PORT, (): void => {
        // eslint-disable-next-line no-console
        console.log(`Server is listening on port ${PORT}...🚀`);
    });
})();

['uncaughtException', 'unhandledRejection'].forEach((event) =>
    process.on(event, (err) => {
        winstonLogError(new Error(`something bad happened : ${event}, msg: ${err.stack || err}`));
        process.exit(1);
    }),
);

// Handle Graceful shutdown
/* eslint-disable no-console */
const shutdown = () => {
    console.log('🛑 Shutting down server...');
    console.log('✅ Shutdown complete');
    process.exit(0);
};
/* eslint-enable no-console */

// Capture termination signals
process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);
