import JWT, { Secret, SignOptions } from 'jsonwebtoken';
import { PayloadType } from '../types/auth';

export function generateToken(payload: PayloadType, secretSignature: Secret, tokenLife: string)
    : Promise<string> {
    try {
        const token = JWT.sign(payload, secretSignature, {
            algorithm: 'HS256',
            expiresIn: tokenLife
        } as SignOptions)
        return Promise.resolve(token);
    } catch (error) {
        return Promise.reject(error);
    }
}

export function verifyToken(token: string, secretSignature: Secret): Promise<PayloadType> {
    try {
        const decoded = JWT.verify(token, secretSignature) as PayloadType;
        return Promise.resolve(decoded);
    } catch (error) {
        return Promise.reject(error);
    }
}
