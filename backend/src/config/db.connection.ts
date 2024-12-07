import mongoose from 'mongoose';

import { appConfig } from './app.config';
import { DatabaseConnectionError } from '../errors';

const connectDb = async () => {
    try {
        await mongoose.connect(appConfig.MONGO_URI, {
            dbName: appConfig.DB_NAME,
            // retryWrites: true,
            // w: 'majority',
            // connectTimeoutMS: 30000, // Increase connection timeout to 30 seconds
            // socketTimeoutMS: 45000, // Increase socket timeout to 45 seconds
        });
        console.log('🛢 Successfully connected to MongoDB...');
    } catch (error: unknown) {
        console.error(error);
        throw new DatabaseConnectionError();
    }
};

export { connectDb };
