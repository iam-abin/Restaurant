import dotenv from 'dotenv';

// Load different .env files based on NODE_ENV
if (process.env.NODE_ENV === 'production') {
    dotenv.config({ path: '.env.production' });
} else {
    dotenv.config({ path: '.env.development' });
}

import { appConfig } from './config/app.config';
import { app } from './app';
import { connectDb } from './config/db.connection';

const PORT: number = appConfig.PORT;

(async () => {
    await connectDb();
    app.listen(PORT, (): void => {
        console.log(`Server is listening on port ${PORT}...🚀`);
    });
})();
