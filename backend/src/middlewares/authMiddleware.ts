import { Request, Response, NextFunction } from "express"
import { StatusCodes } from "http-status-codes"
import { verifyToken } from "../utils/jwt"
import { JwtPayload } from "jsonwebtoken";
import { Permission, PermissionRole, Role, User, UserRole } from "../drizzle/schema";
import { db } from "../config/db";
import { eq, inArray } from "drizzle-orm";

interface AuthenticatedRequest extends Request {
    jwtDecoded?: JwtPayload;
    user?: {
        id: number;
        email: string;
        roles?: string[];
        permissions?: string[];
    };
}

interface AuthError extends Error {
    message: string;
}

async function checkPermission(userId: number, requiredPermission: string): Promise<boolean> {
    const userRoles = await db
        .select({ roleName: Role.name })
        .from(UserRole)
        .innerJoin(Role, eq(UserRole.role_id, Role.id))
        .where(eq(UserRole.user_id, userId))

    const roleNames = userRoles.map(ur => ur.roleName)

    if (roleNames.length === 0) {
        return false
    }

    const permissions = await db
        .select({ permissionName: Permission.name })
        .from(PermissionRole)
        .innerJoin(Permission, eq(PermissionRole.permission_id, Permission.id))
        .innerJoin(Role, eq(PermissionRole.role_id, Role.id))
        .where(inArray(Role.name, roleNames))
    const permissionNames = permissions.map((permission) => permission.permissionName)

    return permissionNames.includes(requiredPermission)
}

export function isAuthorized(requiredPermission: string) {
    return async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
        const accessToken = req.headers.authorization
        if (!accessToken) {
            res.status(StatusCodes.UNAUTHORIZED).json({
                message: "Unauthorized! Token not found"
            })
            return
        }
        try {
            const accessTokenDecoded = await verifyToken(
                accessToken.substring('Bearer '.length),
                process.env.ACCESS_TOKEN_SECRET_SIGNATURE as string
            )
            const user = await db
                .select({
                    id: User.id,
                    email: User.email,
                })
                .from(User)
                .where(eq(User.id, accessTokenDecoded.id))
                .limit(1);

            if (user.length === 0) {
                res.status(StatusCodes.UNAUTHORIZED).json({
                    message: "Unauthorized! User not found",
                });
                return;
            }

            const userRoles = await db
                .select({ roleName: Role.name })
                .from(UserRole)
                .innerJoin(Role, eq(UserRole.role_id, Role.id))
                .where(eq(UserRole.user_id, user[0].id));

            const roleNames = userRoles.map((ur) => ur.roleName);

            const permissions = await db
                .select({ permissionName: Permission.name })
                .from(PermissionRole)
                .innerJoin(Permission, eq(PermissionRole.permission_id, Permission.id))
                .innerJoin(Role, eq(PermissionRole.role_id, Role.id))
                .where(inArray(Role.name, roleNames));

            const permissionNames = permissions.map((p) => p.permissionName);

            req.user = {
                id: user[0].id,
                email: user[0].email,
                roles: roleNames,
                permissions: permissionNames,
            };

            req.jwtDecoded = accessTokenDecoded

            if (requiredPermission) {
                const hasPermission = await checkPermission(user[0].id, requiredPermission);
                if (!hasPermission) {
                    res.status(StatusCodes.FORBIDDEN).json({
                        message: `Forbidden! User does not have permission: ${requiredPermission}`,
                    });
                    return;
                }
            }
            next()
        } catch (error: unknown) {
            const authError = error as AuthError;
            if (authError.message.includes('jwt expired')) {
                res.status(StatusCodes.UNAUTHORIZED).json({
                    message: 'Token has expired! Need to refresh your access token',
                });
                return;
            }
            res.status(StatusCodes.UNAUTHORIZED).json({
                message: "Unauthorized! Please login again"
            })
        }
    }
}

export async function isAuthOnly(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    const accessToken = req.headers.authorization
    if (!accessToken) {
        res.status(StatusCodes.UNAUTHORIZED).json({
            message: "Token not found"
        })
        return
    }
    try {
        const accessTokenDecoded = await verifyToken(
            accessToken.substring("Bearer ".length),
            process.env.ACCESS_TOKEN_SECRET_SIGNATURE as string
        )
        if (!accessTokenDecoded.id) {
            res.status(StatusCodes.UNAUTHORIZED).json({
                message: "Invalid token payload"
            })
            return
        }
        const user = await db
            .select()
            .from(User)
            .where(eq(User.id, accessTokenDecoded.id))
            .limit(1)
        if (user.length === 0) {
            res.status(StatusCodes.UNAUTHORIZED).json({
                message: "User not found"
            })
            return
        }
        req.user = {
            id: user[0].id,
            email: user[0].email
        }
        next()
    } catch (error: unknown) {
        const authError = error as AuthError;
        if (authError.message.includes('jwt expired')) {
            res.status(StatusCodes.UNAUTHORIZED).json({
                message: 'Token has expired! Need to refresh your access token',
            });
            return;
        }
        res.status(StatusCodes.UNAUTHORIZED).json({
            message: "Unauthorized! Please login again"
        })
    }
}


