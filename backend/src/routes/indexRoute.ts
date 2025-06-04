import { Router } from 'express';
import userRoutes from './userRoute';

const router = Router();

// Gắn các route vào endpoint gốc
router.use('/users', userRoutes);


export default router;