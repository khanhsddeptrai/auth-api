import { LoginInput } from "../types/auth"
import { ServiceResponse } from "../types/common"
import { LoginResponseData } from "../types/auth"
import { db } from "../config/db"
import { Session, User } from "../drizzle/schema"
import { eq, desc } from "drizzle-orm"
import { comparePassword } from "../utils/password"
import { generateToken } from "../utils/jwt"
import { LoginAttemp } from "../drizzle/schema"
import redis from "../utils/redis"
import { StatusCodes } from "http-status-codes"
import ms from "ms"

export async function loginUserService(
    dataLogin: LoginInput,
    ip_address: string,
    device_info: any
): Promise<ServiceResponse<LoginResponseData>> {
    try {
        const { email, password } = dataLogin
        const maxAttempts = 5 // Số lần đăng nhập sai tối đa
        const lockoutDuration = ms("15 minutes") / 1000 // trong 15' nếu đăng nhập liên tục sai thì khóa
        const attemptWindow = ms("5 minutes") / 1000 // trong 5 phút nếu không có yêu cầu đăng nhập thì reset lại
        // Kiểm tra trạng thái khóa của IP
        const isIpLocked = await redis.exists(`lockout:ip:${ip_address}`)
        if (isIpLocked) {
            const ttl = await redis.ttl(`lockout:ip:${ip_address}`)
            return {
                statusCode: StatusCodes.TOO_MANY_REQUESTS,
                message: `Lỗi tải! Thử lại sau ${Math.ceil(ttl / 60)} phút.`
            }
        }
        // Kiểm tra người dùng tồn tại
        const existingUser = await db.select().from(User).where(eq(User.email, email)).limit(1)

        let isMatch = false // Biến lưu kết quả so sánh password
        let userId: number | null = null

        // Check tài khoản có đang bị khóa hay không
        if (existingUser.length > 0) {
            userId = existingUser[0].id
            if (existingUser[0].is_active === false) {
                return {
                    statusCode: StatusCodes.FORBIDDEN,
                    message: "Tài khoản đã bị khóa. Vui lòng liên hệ quản trị viên."
                }
            }
            isMatch = await comparePassword(password, existingUser[0].password)
        }
        // Lưu log đăng nhập
        await db.insert(LoginAttemp).values({
            userId,
            is_success: isMatch,
            ip_address,
            device_info: JSON.stringify(device_info)
        })

        if (!isMatch || !userId) {
            await redis.multi()
                .incr(`attempts:ip:${ip_address}`)
                .expire(`attempts:ip:${ip_address}`, attemptWindow)
                .exec()
            const attempts = await redis.get(`attempts:ip:${ip_address}`) || "0"
            // console.log("attempts: ", attempts)
            const remainingAttempts = maxAttempts - (parseInt(attempts) || 0)
            if (parseInt(attempts) >= maxAttempts) {
                await redis.setex(`lockout:ip:${ip_address}`, lockoutDuration, "locked")
                await redis.del(`attempts:ip:${ip_address}`)
                return {
                    statusCode: StatusCodes.TOO_MANY_REQUESTS,
                    message: "IP của bạn bị khóa do quá nhiều lần thử sai. Thử lại sau 15 phút."
                }
            }
            return {
                statusCode: StatusCodes.UNAUTHORIZED,
                message: `Email hoặc mật khẩu không đúng. Còn ${remainingAttempts} lần thử.`
            }
        }

        await redis.del(`attempts:ip:${ip_address}`)

        const payload = {
            id: existingUser[0].id,
            email: existingUser[0].email
        }
        const accessToken = await generateToken(
            payload,
            process.env.ACCESS_TOKEN_SECRET_SIGNATURE as string,
            "30s"
        )
        const refreshToken = await generateToken(
            payload,
            process.env.REFRESH_TOKEN_SECRET_SIGNATURE as string,
            "7 days"
        )
        const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

        await db.insert(Session).values({
            userId,
            refresh_token: refreshToken,
            expires_at: expiresAt,
            ip_address,
            is_valid: true,
            device_info
        })

        return {
            statusCode: StatusCodes.OK,
            message: "Login user successfully",
            data: {
                accessToken,
                refreshToken,
                payload
            }
        }
    } catch (error) {
        return {
            statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
            message: `Failed to login user: ${(error as Error).message}`
        };
    }
}
