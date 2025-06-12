export interface CreateRoleInput {
    name: string;
    description?: string;
}

export interface CreatePermissionInput {
    name: string;
    description?: string;
}

export interface AssignPermissionToRoleInput {
    roleId: number;
    permissionId: number;
}

export interface AssignUserToRoleInput {
    userId: number;
    roleId: number;
}

export interface RoleResponseData {
    id?: number;
    name: string;
    description?: string | null;
}

export interface PermissionResponseData {
    id: number;
    name: string;
    description?: string | null;
}