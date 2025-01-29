import { appConfig } from '../config/app.config';

export const GOOGLE_TOKEN_INFO_URL: string = 'https://oauth2.googleapis.com/tokeninfo?id_token=';

export const RESET_PASSWORD_URL: string = `${appConfig.FRONTEND_URLS}/reset-password`;
