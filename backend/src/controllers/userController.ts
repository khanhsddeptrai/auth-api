import { Request, Response } from 'express';
// import { createNewUser, getAllUsers } from '../services/userService';
// import { CreateUserBody } from '../types/user';

// export async function createUser(req: Request<{}, {}, CreateUserBody>, res: Response): Promise<void> {
//     try {
//         const { name, age, email } = req.body;
//         if (!name || !age || !email) {
//             res.status(400).json({ error: 'Missing required fields' });
//             return
//         }

//         const user = await createNewUser({ name, age, email });
//         res.status(201).json(user);
//     } catch (error) {
//         res.status(500).json({ error: (error as Error).message });
//     }
// }

// export async function getListUser(req: Request, res: Response): Promise<void> {
//     try {
//         const users = await getAllUsers()
//         res.status(200).json(users);
//     } catch (error) {
//         res.status(500).json({ error: (error as Error).message });
//     }

// }