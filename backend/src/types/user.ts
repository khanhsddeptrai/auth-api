export interface UserType {
    id?: number;
    full_name: string;
    email: string;
    password: string;
    is_active?: boolean;
    created_at?: Date;
}

export interface UserTypeExist extends UserType {
    id: number;
}
