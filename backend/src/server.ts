import express from 'express';
import indexRoute from './routes/indexRoute';
import cors from 'cors';

const app = express();
app.use(
    cors({
        origin: 'http://localhost:5173',
        methods: ['GET', 'POST'],
        credentials: true,
    })
);
app.use(express.json());
app.use('/api', indexRoute);

export default app;