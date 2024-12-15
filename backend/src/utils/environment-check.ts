import { appConfig } from '../config/app.config';

export const isProduction = (): boolean => appConfig.NODE_ENVIRONMENT === 'production';
