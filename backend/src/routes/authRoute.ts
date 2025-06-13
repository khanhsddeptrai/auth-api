import { Router } from 'express';
import {
    loginUser, refreshTokenController, logoutUserController

} from '../controllers/authController';

const router = Router();

router.post('/login', loginUser);
router.patch('/logout', logoutUserController);
router.post('/refresh-token', refreshTokenController);

export default router;