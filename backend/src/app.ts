import 'reflect-metadata';
import 'express-async-errors';
import express, { Application, Request, Response } from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import cors from 'cors';
import { NotFoundError } from './errors';
import { errorHandler, rateLimiter } from './middlewares';
import { userRoute } from './routes/user';
import { appConfig } from './config/app.config';

const app: Application = express();

const isProductionENV: boolean = appConfig.NODE_ENVIRONMENT === 'production';

// Set trust proxy
app.set('trust proxy', true); // Trust all proxies

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(
    cors({
        origin: '*',
    }),
);
if (!isProductionENV) app.use(morgan('dev'));

app.use(rateLimiter);
// Routes
app.use(`${appConfig.API_PREFIX}`, userRoute);

app.all('*', (req: Request, res: Response): never => {
    throw new NotFoundError();
});

app.use(errorHandler);

export { app };
