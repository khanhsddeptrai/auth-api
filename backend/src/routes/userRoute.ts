import { Router } from 'express';
const router = Router();
import {
    createUser, updateUser, getAllUser, deleteUser, getDetailUser,
    changePasswordController
} from '../controllers/userController';
import { isAuthOnly, isAuthorized } from '../middlewares/authMiddleware';


router.post('/create', createUser);
router.get('/get-all', isAuthorized("view_users"), getAllUser);
router.patch('/update/:id', updateUser);
router.delete('/delete/:id', deleteUser);
router.get('/:id', isAuthOnly, getDetailUser);
router.patch('/change-password/:userId', isAuthOnly, changePasswordController);

export default router;