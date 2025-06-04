import express, { Request, Response } from 'express';
import indexRoute from './routes/indexRoute';

const app = express();

app.use(express.json());
app.use('/api', indexRoute);

export default app;