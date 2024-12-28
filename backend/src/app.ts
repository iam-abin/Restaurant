import 'reflect-metadata';
import 'express-async-errors';
import express, { Application, Request, Response } from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import { NotFoundError } from './errors';
import { errorHandler } from './middlewares';
import {
    authRoutes,
    cartRoutes,
    cuisineRoutes,
    dashboardRoutes,
    menuRoutes,
    orderRoutes,
    profileRoutes,
    ratingRoutes,
    restaurantRoutes,
} from './routes';
import { appConfig } from './config/app.config';

const app: Application = express();

const isProductionENV: boolean = appConfig.NODE_ENVIRONMENT === 'production';

// // Set trust proxy
// app.set('trust proxy', true); // Trust all proxies

// Middlewares
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(helmet());
app.disable('x-powered-by');
app.use(
    cors({
        origin: appConfig.FRONTEND_URL,
        credentials: true,
    }),
);
app.use(compression());
app.use(cookieParser());
if (!isProductionENV) app.use(morgan('dev'));

// app.use(rateLimiter);
// Routes
app.use(`${appConfig.API_PREFIX}/auth`, authRoutes);
app.use(`${appConfig.API_PREFIX}/cart`, cartRoutes);
app.use(`${appConfig.API_PREFIX}/cuisine`, cuisineRoutes);
app.use(`${appConfig.API_PREFIX}/dashboard`, dashboardRoutes);
app.use(`${appConfig.API_PREFIX}/menu`, menuRoutes);
app.use(`${appConfig.API_PREFIX}/order`, orderRoutes);
app.use(`${appConfig.API_PREFIX}/profile`, profileRoutes);
app.use(`${appConfig.API_PREFIX}/rating`, ratingRoutes);
app.use(`${appConfig.API_PREFIX}/restaurant`, restaurantRoutes);

app.all('*', (req: Request, res: Response): never => {
    throw new NotFoundError();
});

app.use(errorHandler);

export { app };
