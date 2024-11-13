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
import { userRoute } from './routes/auth.routes';
import { restaurantRoute } from './routes/restaurant.routes';
import { menuRoute } from './routes/menu.routes';
import { appConfig } from './config/app.config';

const app: Application = express();

const isProductionENV: boolean = appConfig.NODE_ENVIRONMENT === 'production';

// // Set trust proxy
// app.set('trust proxy', true); // Trust all proxies

// Middlewares
app.use(express.json({limit: '10mb'}));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(helmet());
app.use(
    cors({
        origin: '*',
    }),
);
app.use(compression());
app.use(cookieParser());
if (!isProductionENV) app.use(morgan('dev'));

app.use(rateLimiter);
// Routes
app.use(`${appConfig.API_PREFIX}/auth`, userRoute);
app.use(`${appConfig.API_PREFIX}/menu`, menuRoute);
app.use(`${appConfig.API_PREFIX}/restaurant`, restaurantRoute);

app.all('*', (req: Request, res: Response): never => {
    throw new NotFoundError();
});

app.use(errorHandler);

export { app };
