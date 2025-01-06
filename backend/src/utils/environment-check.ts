import { appConfig } from '../config/app.config';

/**
 * Checks if the current environment is 'production'.
 * This function compares the value of `NODE_ENVIRONMENT` from the appConfig.
 * It returns `true` if the environment is 'production', and `false` otherwise.
 *
 * @returns {boolean} - `true` if in production environment, `false` otherwise.
 */
export const isProduction = (): boolean => appConfig.NODE_ENVIRONMENT === 'production';
