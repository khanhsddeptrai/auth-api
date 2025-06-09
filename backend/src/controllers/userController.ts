import { Request, Response } from 'express';
import {
    createNewUser, updateUserService, getAllUserService, deleteUserService,
    getDetailUserService
}
    from '../services/userService';
import { UserType } from '../types/user';
import { StatusCodes } from 'http-status-codes';

export async function createUser(req: Request<{}, {}, UserType>, res: Response): Promise<void> {
    try {
        const { full_name, email, password } = req.body;
        if (!full_name || !password || !email) {
            res.status(400).json({ error: 'Missing required fields' });
            return
        }
        const user = await createNewUser(req.body);
        res.status(201).json(user);
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ error: (error as Error).message })
    }
}

export async function updateUser(req: Request<{ id: string }, {}, UserType, {}>, res: Response): Promise<void> {
    try {
        const { full_name, email, password, is_active } = req.body
        const id = req.params.id
        const updatedUser = await updateUserService(id, req.body)
        res.status(200).json(updatedUser);
    } catch (error) {
        console.error('Error updating user:', error)
        res.status(500).json({ error: (error as Error).message })
    }
}

export async function getAllUser(req: Request, res: Response): Promise<void> {
    try {
        const users = await getAllUserService()
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
}

export async function deleteUser(req: Request<{ id: string }>, res: Response): Promise<void> {
    try {
        const id = req.params.id;
        const deletedUser = await deleteUserService(id);
        res.status(200).json(deletedUser);
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ error: (error as Error).message });
    }
}

export async function getDetailUser(req: Request<{ id: string }>, res: Response): Promise<void> {
    try {
        const id = req.params.id;
        const user = await getDetailUserService(id);
        res.status(StatusCodes.OK).json(user);
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: (error as Error).message });
    }
}