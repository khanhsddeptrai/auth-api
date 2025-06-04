import { db } from '../config/db';
// import { CreateUserBody, User } from '../types/user';
import { ServiceResponse } from '../types/common';
import { eq } from 'drizzle-orm';

// export async function createNewUser(userData: CreateUserBody): Promise<ServiceResponse<User[]>> {
//     try {
//         let userId = await db
//             .insert(user)
//             .values(userData)
//             .$returningId();
//         const userInfo = await db
//             .select()
//             .from(user)
//             .where(eq(user.id, userId[0].id))
//         return {
//             statusCode: 201,
//             message: "User created successfully",
//             data: userInfo
//         };
//     } catch (error) {
//         throw new Error(`Failed to create user: ${(error as Error).message}`);
//     }
// }

// export async function getAllUsers(): Promise<ServiceResponse<User[]>> {
//     try {
//         const users = await db.select().from(user);
//         return {
//             statusCode: 200,
//             message: "Users retrieved successfully",
//             data: users,
//         }
//     } catch (error) {
//         throw new Error(`Failed to fetch users: ${(error as Error).message}`);
//     }
// }