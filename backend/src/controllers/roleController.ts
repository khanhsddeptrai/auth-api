import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { AssignPermissionToRoleInput, AssignUserToRoleInput, CreateRoleInput } from '../types/role';
import {
    createNewRole, createNewPermission, assignPermissionToRole,
    assignUserToRole, getAllRole, updateRole, getAllPermission,
    updatePermission
} from '../services/roleService';

export async function createRole(req: Request<{}, {}, CreateRoleInput>, res: Response): Promise<void> {
    try {
        const { name, description } = req.body
        const role = await createNewRole(req.body)
        res.status(role.statusCode).json(role);
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: (error as Error).message });
    }
}

export async function createPermission(req: Request<{}, {}, CreateRoleInput>, res: Response): Promise<void> {
    try {
        const { name, description } = req.body
        const permission = await createNewPermission(req.body)
        res.status(permission.statusCode).json(permission);
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: (error as Error).message });
    }
}

export async function assignPermissionToRoleController(
    req: Request<{}, {}, AssignPermissionToRoleInput>,
    res: Response
): Promise<void> {
    // const { roleId, permissionId } = req.body
    const result = await assignPermissionToRole(req.body);
    res.status(result.statusCode).json(result);
}

export async function assignUserToRoleController(
    req: Request<{}, {}, AssignUserToRoleInput>,
    res: Response
): Promise<void> {
    const result = await assignUserToRole(req.body);
    res.status(result.statusCode).json(result);
}

export async function getAllRoleController(req: Request, res: Response): Promise<void> {
    try {
        const result = await getAllRole();
        res.status(result.statusCode).json(result);
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: (error as Error).message });
    }
}

export async function updateRoleController(req: Request<{ id: string }, {}, CreateRoleInput>, res: Response): Promise<void> {
    try {
        const id = req.params.id
        const result = await updateRole(id, req.body);
        res.status(result.statusCode).json(result);
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: (error as Error).message });
    }
}

export async function getAllPermissionController(req: Request, res: Response): Promise<void> {
    try {
        const result = await getAllPermission();
        res.status(result.statusCode).json(result);
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: (error as Error).message });
    }
}

export async function updatePermissionController(req: Request<{ id: string }, {}, CreateRoleInput>, res: Response): Promise<void> {
    try {
        const id = req.params.id
        const result = await updatePermission(id, req.body);
        res.status(result.statusCode).json(result);
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: (error as Error).message });
    }
}