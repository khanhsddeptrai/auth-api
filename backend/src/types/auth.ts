export interface LoginInput {
    email: string;
    password: string;
}

export interface PayloadType {
    id: number;
    email: string;
}

export interface LoginResponseData {
    accessToken: string;
    refreshToken: string;
    payload: {
        id: number;
        email: string;
    };
}

export interface PasswordInput {
    odlPassword: string;
    newPassword: string;
    confirmPassword: string;
}