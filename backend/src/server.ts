import express from 'express';
import indexRoute from './routes/indexRoute';
import cors from 'cors';

const app = express();

// Fix Cache from disk from ExpressJS
app.use((req, res, next) => {
    res.set('Cache-Control', 'no-store')
    next()
})

app.use(
    cors({
        origin: 'http://localhost:5173',
        methods: ['GET', 'POST', 'PATCH', 'DELETE'],
        credentials: true,
    })
);
app.use(express.json());
app.use('/api', indexRoute);

export default app;