import { Router } from 'express';
const router = Router();
import {
    createUser, updateUser, getAllUser, deleteUser, getDetailUser
} from '../controllers/userController';

router.post('/create', createUser);
router.get('/get-all', getAllUser);
router.patch('/update/:id', updateUser);
router.delete('/delete/:id', deleteUser);
router.get('/:id', getDetailUser);


export default router;