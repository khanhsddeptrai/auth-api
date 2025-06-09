import { Request, Response } from 'express';
import { LoginInput } from '../types/auth';
import { loginUserService } from '../services/authService';
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