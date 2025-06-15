import { Request, Response } from 'express';
import { LoginInput, PasswordInput } from '../types/auth';
import { loginUserService, logoutUserService, refreshTokenService } from '../services/authService';
import { StatusCodes } from 'http-status-codes';
import useragent from 'useragent';
import requestIp from 'request-ip';

export async function loginUser(req: Request<{}, {}, LoginInput>, res: Response): Promise<void> {
    try {
        const { email, password } = req.body;
        const ipAddress: string = requestIp.getClientIp(req) || 'unknown';
        const agent = useragent.parse(req.headers['user-agent']);
        const login = await loginUserService(req.body, ipAddress, agent);
        res.status(login.statusCode).json(login)

    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: (error as Error).message });
    }
}

export async function refreshTokenController(req: Request<{}, {}, { refreshToken: string }>, res: Response): Promise<void> {
    try {
        const { refreshToken } = req.body;
        const result = await refreshTokenService(refreshToken);
        res.status(result.statusCode).json(result)

    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: (error as Error).message });
    }
}

export async function logoutUserController(
    req: Request<{}, {}, { sessionId: number, userId: number }>,
    res: Response
): Promise<void> {
    try {
        const { sessionId, userId } = req.body
        const result = await logoutUserService(sessionId, userId)
        res.status(result.statusCode).json(result)

    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: (error as Error).message });
    }

}

