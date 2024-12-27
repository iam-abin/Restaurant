import mongoose from 'mongoose';

import { appConfig } from './app.config';
import { DatabaseConnectionError } from '../errors';

const connectDb = async () => {
    try {
        await mongoose.connect(`${appConfig.MONGO_URI}/${appConfig.DB_NAME}`);
        // eslint-disable-next-line no-console
        console.log('🛢 Successfully connected to MongoDB...');
    } catch (error: unknown) {
        // eslint-disable-next-line no-console
        console.error(error);
        throw new DatabaseConnectionError();
    }
};

export { connectDb };
