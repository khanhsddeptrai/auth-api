import { Router } from 'express';
import userRoutes from './userRoute';
import authRoutes from './authRoute';

const router = Router();

// Gắn các route vào endpoint gốc
router.use('/users', userRoutes);
router.use('/auth', authRoutes);


export default router;