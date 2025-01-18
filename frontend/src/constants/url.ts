// export const PRODUCTION_ORIGIN: string = "https://abinvarghese.online"
const DEVELOPMENT_BACKEND_ORIGIN: string = import.meta.env.VITE_BACKEND_URL;

export const BASE_URL_BACKEND: string = `${DEVELOPMENT_BACKEND_ORIGIN}/api/v1`;
