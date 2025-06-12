import { StatusCodes } from "http-status-codes";
import { db } from "../config/db";
import { Role, Permission, PermissionRole, User, UserRole } from "../drizzle/schema";
import { and, eq, ne } from "drizzle-orm";
import {
    CreateRoleInput, CreatePermissionInput, AssignPermissionToRoleInput,
    RoleResponseData, PermissionResponseData,
    AssignUserToRoleInput
} from "../types/role";
import { ServiceResponse } from "../types/common";

export async function createNewRole(data: CreateRoleInput): Promise<ServiceResponse<RoleResponseData>> {
    try {
        // Kiểm tra xem role đã tồn tại chưa
        const existingRole = await db.select().from(Role).where(eq(Role.name, data.name)).limit(1);
        if (existingRole.length > 0) {
            return {
                statusCode: StatusCodes.CONFLICT,
                message: `Role '${data.name}' already exists`,
            };
        }
        // Tạo role mới
        const newRoleId = await db
            .insert(Role)
            .values({
                name: data.name,
                description: data.description
            })
            .$returningId();
        const roleData = await db.select().from(Role).where(eq(Role.id, newRoleId[0].id))
        return {
            statusCode: StatusCodes.CREATED,
            message: "Role created successfully",
            data: roleData[0]
        };
    } catch (error) {
        return {
            statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
            message: `Failed to create role: ${(error as Error).message}`,
        };
    }
}

export async function createNewPermission(data: CreatePermissionInput): Promise<ServiceResponse<PermissionResponseData>> {
    try {
        // Kiểm tra xem role đã tồn tại chưa
        const existingPermission = await db.select().from(Permission).where(eq(Permission.name, data.name)).limit(1);
        if (existingPermission.length > 0) {
            return {
                statusCode: StatusCodes.CONFLICT,
                message: `Permission '${data.name}' already exists`,
            };
        }
        // Tạo role mới
        const newPermissionId = await db
            .insert(Permission)
            .values({
                name: data.name,
                description: data.description
            })
            .$returningId();
        const permissionData = await db.select().from(Permission).where(eq(Permission.id, newPermissionId[0].id))
        return {
            statusCode: StatusCodes.CREATED,
            message: "Permission created successfully",
            data: permissionData[0]
        };
    } catch (error) {
        return {
            statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
            message: `Failed to create Permission: ${(error as Error).message}`,
        };
    }
}

export async function assignPermissionToRole(
    data: AssignPermissionToRoleInput
): Promise<ServiceResponse<null>> {
    try {
        const role = await db.select().from(Role).where(eq(Role.id, data.roleId)).limit(1);
        const permission = await db
            .select()
            .from(Permission)
            .where(eq(Permission.id, data.permissionId))
            .limit(1);

        if (role.length === 0 || permission.length === 0) {
            return {
                statusCode: StatusCodes.NOT_FOUND,
                message: "Role or permission not found",
            };
        }

        const existingAssignment = await db
            .select()
            .from(PermissionRole)
            .where(
                and(
                    eq(PermissionRole.role_id, data.roleId),
                    eq(PermissionRole.permission_id, data.permissionId)
                )
            )
            .limit(1);

        if (existingAssignment.length > 0) {
            return {
                statusCode: StatusCodes.CONFLICT,
                message: "Permission is already assigned to this role",
            };
        }

        await db.insert(PermissionRole).values({
            role_id: data.roleId,
            permission_id: data.permissionId,
        });

        return {
            statusCode: StatusCodes.OK,
            message: "Permission assigned to role successfully",
            data: null,
        };
    } catch (error) {
        return {
            statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
            message: `Failed to assign permission to role: ${(error as Error).message}`,
        };
    }
}

export async function assignUserToRole(
    data: AssignUserToRoleInput
): Promise<ServiceResponse<null>> {
    try {
        const user = await db.select().from(User).where(eq(User.id, data.userId)).limit(1);
        const role = await db.select().from(Role).where(eq(Role.id, data.roleId)).limit(1);

        if (role.length === 0 || user.length === 0) {
            return {
                statusCode: StatusCodes.NOT_FOUND,
                message: "User or Role not found",
            };
        }

        const existingAssignment = await db
            .select()
            .from(UserRole)
            .where(
                and(
                    eq(UserRole.user_id, data.userId),
                    eq(UserRole.role_id, data.roleId)
                )
            )
            .limit(1);

        if (existingAssignment.length > 0) {
            return {
                statusCode: StatusCodes.CONFLICT,
                message: "Role is already assigned to this user",
            };
        }

        await db.insert(UserRole).values({
            user_id: data.userId,
            role_id: data.roleId
        });

        return {
            statusCode: StatusCodes.OK,
            message: "Role assigned to this user successfully",
            data: null,
        };
    } catch (error) {
        return {
            statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
            message: `Failed to assign role to user: ${(error as Error).message}`,
        };
    }
}

export async function getAllRole(): Promise<ServiceResponse<{}>> {
    try {
        const roles = await db.select().from(Role)
        return {
            statusCode: StatusCodes.OK,
            message: "Roles retrieved successfully",
            data: roles
        }
    } catch (error) {
        throw new Error(`Failed to fetch users: ${(error as Error).message}`);
    }
}

export async function updateRole(id: string, data: CreateRoleInput): Promise<ServiceResponse<{}>> {
    try {
        const roleId = parseInt(id, 10)
        const { name, description } = data

        const existingRole = await db.select().from(Role).where(eq(Role.id, roleId)).limit(1);
        if (existingRole.length === 0) {
            throw new Error('Role not found');
        }

        const updateData: Partial<CreateRoleInput> = {};
        if (name && name.trim() === existingRole[0].name) {
            throw new Error('Role name already exists')
        }
        if (name) {
            const existingRoleByName = await db
                .select({ id: Role.id })
                .from(Role)
                .where(
                    and(
                        ne(Role.id, roleId),
                        eq(Role.name, name) // Loại trừ role hiện tại
                    )
                )
                .limit(1);
            if (existingRoleByName.length > 0) {
                throw new Error('Role name already exists')
            }
            updateData.name = name.trim()
        }

        if (description) {
            updateData.description = description.trim()
        }

        await db
            .update(Role)
            .set(updateData)
            .where(eq(Role.id, roleId))

        return {
            statusCode: StatusCodes.OK,
            message: "Role updated successfully",
            data: updateData
        }
    } catch (error) {
        throw new Error(`Failed to fetch users: ${(error as Error).message}`);
    }
}

export async function getAllPermission(): Promise<ServiceResponse<{}>> {
    try {
        const permissions = await db.select().from(Permission)
        return {
            statusCode: StatusCodes.OK,
            message: "Permissions retrieved successfully",
            data: permissions
        }
    } catch (error) {
        throw new Error(`Failed to fetch users: ${(error as Error).message}`);
    }
}

export async function updatePermission(id: string, data: CreateRoleInput): Promise<ServiceResponse<{}>> {
    try {
        const permissionId = parseInt(id, 10)
        const { name, description } = data

        const existingPermission = await db.select().from(Permission).where(eq(Permission.id, permissionId)).limit(1);
        if (existingPermission.length === 0) {
            throw new Error('Permission not found');
        }

        const updateData: Partial<CreateRoleInput> = {};
        if (name && name.trim() === existingPermission[0].name) {
            throw new Error('Permission name already exists')
        }
        if (name) {
            const existingPermissionByName = await db
                .select({ id: Permission.id })
                .from(Permission)
                .where(
                    and(
                        ne(Permission.id, permissionId),
                        eq(Permission.name, name) // Loại trừ role hiện tại
                    )
                )
                .limit(1);
            if (existingPermissionByName.length > 0) {
                throw new Error('Permission name already exists')
            }
            updateData.name = name.trim()
        }

        if (description) {
            updateData.description = description.trim()
        }

        await db
            .update(Permission)
            .set(updateData)
            .where(eq(Permission.id, permissionId))

        return {
            statusCode: StatusCodes.OK,
            message: "Permission updated successfully",
            data: updateData
        }
    } catch (error) {
        throw new Error(`Failed to fetch users: ${(error as Error).message}`);
    }
}