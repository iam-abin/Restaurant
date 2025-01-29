import 'reflect-metadata';
import 'express-async-errors';
import express, { Application, Request, Response } from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import { NotFoundError } from './errors';
import { errorHandler, rateLimiter } from './middlewares';
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
import { checkNodeEnvironment } from './utils';
import { NodeEnvironment } from './types';

const app: Application = express();

const isProductionENV: boolean = checkNodeEnvironment(NodeEnvironment.PRODUCTION);

// Set trust proxy
app.set('trust proxy', 1); // Trust the first proxy

// Middlewares
app.use(helmet());
app.disable('x-powered-by');
app.use(
    cors({
        origin: appConfig.FRONTEND_URLS,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
        allowedHeaders: ['Content-Type', 'Set-Cookie'],
        credentials: true,
    }),
);

app.use(compression());
app.use(cookieParser());
if (!isProductionENV) app.use(morgan('dev'));

app.use(rateLimiter);

// Webhook route: Use express.raw() to preserve the raw payload as a Buffer.
// This is necessary for signature verification of Stripe webhooks.
// It must be defined before express.json(), as express.json() modifies the request body.
app.use(`${appConfig.API_PREFIX}/webhook`, express.raw({ type: 'application/json' }), orderRoutes);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Other routes
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
