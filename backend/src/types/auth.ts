export interface LoginInput {
    email: string;
    password: string;
}

export interface PayloadType {
    id: number;
    email: string;
    // sessionId: number
}

export interface LoginResponseData {
    accessToken: string;
    refreshToken: string;
    sessionId?: number;
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