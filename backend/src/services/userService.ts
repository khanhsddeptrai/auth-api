import { db } from '../config/db';
import { ServiceResponse } from '../types/common';
import { eq, ne, and } from 'drizzle-orm';
import { UserType } from '../types/user';
import { User } from '../drizzle/schema';
import { z } from 'zod';
import { comparePassword, hashPassword } from '../utils/password';
import { UserValidate } from '../validates/inputUser';
import { StatusCodes } from 'http-status-codes';
import { checkExistingUser } from '../utils/user';
import { PasswordInput } from '../types/auth';

type CreateUserInput = z.infer<typeof UserValidate>;

export async function createNewUser(userData: CreateUserInput): Promise<ServiceResponse<UserType[]>> {
    try {
        const { full_name, email, password } = UserValidate.parse(userData);
        const existingUser = await db.select({ id: User.id }).from(User).where(eq(User.email, email)).limit(1);
        if (existingUser.length > 0) {
            throw new Error('Email already exists');
        }
        const hashedPassword = await hashPassword(password);

        const newUser: UserType = {
            full_name,
            email,
            password: hashedPassword,
        }
        let userId = await db.insert(User).values(newUser).$returningId();
        const userInfo = await db.select().from(User).where(eq(User.id, userId[0].id))
        return {
            statusCode: 201,
            message: "User created successfully",
            data: userInfo
        };
    } catch (error) {
        throw new Error(`Failed to create user: ${(error as Error).message}`);
    }
}

export const updateUserService = async (id: string, userData: UserType): Promise<ServiceResponse<[]>> => {
    try {
        const { full_name, email, password, is_active } = userData
        if (!/^\d+$/.test(id)) {
            throw new Error('Invalid ID format. ID must be a valid number.');
        }
        const userId = parseInt(id, 10);
        const existingUser = await db.select().from(User).where(eq(User.id, userId)).limit(1);
        if (existingUser.length === 0) {
            throw new Error('User not found');
        }

        const updateData: Partial<UserType> = {};
        if (userData.full_name) {
            updateData.full_name = userData.full_name.trim();
        }
        if (userData.email) {
            const normalizedEmail = userData.email.toLowerCase().trim();
            // Kiểm tra email trùng lặp, loại trừ người dùng hiện tại
            const existingUserByEmail = await db
                .select({ id: User.id })
                .from(User)
                .where(
                    and(
                        eq(User.email, normalizedEmail),
                        ne(User.id, userId) // Loại trừ người dùng hiện tại
                    )
                )
                .limit(1);
            if (existingUserByEmail.length > 0) {
                throw new Error('Email already exists');
            }
            updateData.email = normalizedEmail;
        }
        if (userData.password) {
            updateData.password = await hashPassword(userData.password);
        }
        if (userData.is_active !== undefined) {
            updateData.is_active = userData.is_active;
        }
        await db
            .update(User)
            .set(updateData)
            .where(eq(User.id, userId))
        return {
            statusCode: 200,
            message: 'User updated successfully',
        };
    } catch (error) {
        throw new Error(`Failed to update user: ${(error as Error).message}`);
    }
}

export async function getAllUserService(): Promise<ServiceResponse<{}>> {
    try {
        const users = await db.select().from(User);
        return {
            statusCode: 200,
            message: "Users retrieved successfully",
            data: users
        }
    } catch (error) {
        throw new Error(`Failed to fetch users: ${(error as Error).message}`);
    }
}

export async function deleteUserService(id: string): Promise<ServiceResponse<{}>> {
    try {
        if (!/^\d+$/.test(id)) {
            throw new Error('Invalid ID format. ID must be a valid number.');
        }
        const userId = parseInt(id, 10);
        const existingUser = await db.select().from(User).where(eq(User.id, userId)).limit(1);
        if (existingUser.length === 0) {
            throw new Error('User not found');
        }
        const deletedUser = await db.delete(User).where(eq(User.id, userId));
        return {
            statusCode: 200,
            message: "Deleted user successfully",
            data: deletedUser
        }
    } catch (error) {
        throw new Error(`Failed to fetch users: ${(error as Error).message}`);
    }
}

export async function getDetailUserService(id: string): Promise<ServiceResponse<{}>> {
    try {
        if (!/^\d+$/.test(id)) {
            throw new Error('Invalid ID format. ID must be a valid number.');
        }
        const userId = parseInt(id, 10);
        const existingUser = await db.select().from(User).where(eq(User.id, userId)).limit(1);
        if (existingUser.length === 0) {
            throw new Error('User not found');
        }
        const user = await db.select().from(User).where(eq(User.id, userId));
        return {
            statusCode: StatusCodes.OK,
            message: "Get detail user successfully",
            data: user
        }
    } catch (error) {
        throw new Error(`Failed to fetch users: ${(error as Error).message}`);
    }
}

export async function changePassword(userId: string, data: PasswordInput): Promise<ServiceResponse<{}>> {
    try {
        const existingUser = await checkExistingUser(parseInt(userId))
        if (!existingUser) {
            return {
                statusCode: StatusCodes.NOT_FOUND,
                message: "User not found!"
            }
        }

        const { odlPassword, newPassword, confirmPassword } = data

        if (!odlPassword || !newPassword || !confirmPassword) {
            return {
                statusCode: StatusCodes.BAD_REQUEST,
                message: "Passwords input is required!"
            }
        }

        const checkPassword = await comparePassword(odlPassword, existingUser.password)
        if (!checkPassword) {
            return {
                statusCode: StatusCodes.UNAUTHORIZED,
                message: `Old password is incorrect `
            }
        }

        if (newPassword !== confirmPassword) {
            return {
                statusCode: StatusCodes.UNAUTHORIZED,
                message: `New password is not the same`
            }
        }

        const newPasswordHash = await hashPassword(newPassword)

        await db
            .update(User)
            .set({ password: newPasswordHash })
            .where(eq(User.id, parseInt(userId)))

        return {
            statusCode: StatusCodes.OK,
            message: "Change password successfully!"
        }

    } catch (error) {
        return {
            statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
            message: `Change password failed: ${(error as Error).message}`
        }
    }
}