import { appConfig } from '../config/app-config';
import { NodeEnvironment } from '../types';

/**
 * Checks the current node environment of the application.
 *
 * @param {NodeEnvironment} environment provide the environment name to check
 * @returns  {boolean} - `true` if in current node environment, matches with the provided one  `false` otherwise.
 */
export const checkNodeEnvironment = (environment: NodeEnvironment): boolean =>
    appConfig.NODE_ENVIRONMENT === environment;
