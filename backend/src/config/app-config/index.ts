import dotenv from 'dotenv';
dotenv.config();
import { IAppConfig, NodeEnvironment } from '../../types';

// Load different .env files based on NODE_ENV
switch (process.env.NODE_ENV) {
    case NodeEnvironment.PRODUCTION:
        dotenv.config({ path: '.env.production' });
        break;
    case NodeEnvironment.TEST:
        dotenv.config({ path: '.env.test' });
        break;
    default:
        dotenv.config({ path: '.env.development' });
}

import * as devConfig from './dev.config';
import * as prodConfig from './prod.config ';
import * as testConfig from './test.config';

let appConfig: IAppConfig;
let optionalEnvVariables: string[] = [];

// Set app configuration based on environment.
switch (process.env.NODE_ENV) {
    case NodeEnvironment.PRODUCTION:
        appConfig = prodConfig.appConfig;
        optionalEnvVariables = prodConfig.optionalEnvVariables;
        break;
    case NodeEnvironment.TEST:
        appConfig = testConfig.appConfig;
        optionalEnvVariables = testConfig.optionalEnvVariables;
        break;
    default:
        appConfig = devConfig.appConfig;
        optionalEnvVariables = devConfig.optionalEnvVariables;
}

// Validation
const REQUIRED_ENV_VARIABLES = (Object.keys(appConfig) as (keyof IAppConfig)[]).filter(
    (key: keyof IAppConfig) => !(optionalEnvVariables as readonly string[]).includes(key as string),
);
const missingEnvVariables: string[] = REQUIRED_ENV_VARIABLES.filter((key: keyof IAppConfig) => {
    const value: string | number | string[] = appConfig[key];
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

export { appConfig };
