import { Router } from 'express';
const router = Router();
import {
    createRole, createPermission, assignPermissionToRoleController,
    assignUserToRoleController, getAllRoleController, updateRoleController,
    getAllPermissionController, updatePermissionController
} from '../controllers/roleController';

router.post('/new-role', createRole);
router.post('/new-permission', createPermission);
router.post('/new-role-permission', assignPermissionToRoleController);
router.post('/new-user-role', assignUserToRoleController);
router.get('/get-all-role', getAllRoleController);
router.patch('/update-role/:id', updateRoleController);
router.get('/get-all-permission', getAllPermissionController);
router.patch('/update-permission/:id', updatePermissionController);


export default router;