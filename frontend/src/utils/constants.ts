import { getThisYear } from './date';

// export const PRODUCTION_ORIGIN: string = "https://abinvarghese.online"
export const DEVELOPMENT_BACKEND_ORIGIN: string = import.meta.env.VITE_BACKEND_URL;

export const BASE_URL_BACKEND: string = `${DEVELOPMENT_BACKEND_ORIGIN}/api/v1`;

export const TOP_RATED_MINIMUM_VALUE: number = 3;

export const CURRENT_YEAR: number = getThisYear() || 2025;
