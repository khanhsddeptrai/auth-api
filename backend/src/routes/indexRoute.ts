import { Router } from 'express';
import userRoutes from './userRoute';
import authRoutes from './authRoute';
import roleRoutes from './roleRoute'

const router = Router();

// Gắn các route vào endpoint gốc
router.use('/users', userRoutes);
router.use('/auth', authRoutes);
router.use('/roles', roleRoutes);

export default router;