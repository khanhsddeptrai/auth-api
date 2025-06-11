import { Request, Response, NextFunction } from "express"
import { StatusCodes } from "http-status-codes"
import { verifyToken } from "../utils/jwt"
import { JwtPayload } from "jsonwebtoken";

interface AuthenticatedRequest extends Request {
    jwtDecoded?: JwtPayload;
}

interface AuthError extends Error {
    message: string;
}


async function isAuthorized(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    const accessToken = req.headers.authorization
    console.log("token from middleware: ", accessToken)
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
        req.jwtDecoded = accessTokenDecoded
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

export const authMiddleware = {
    isAuthorized
}
