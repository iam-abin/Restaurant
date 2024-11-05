import express, { Application } from 'express';
const app: Application = express();

// Middlewares
app.use(express.json());


export { app };