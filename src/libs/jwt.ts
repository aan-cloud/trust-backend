import { createJWT, validateJWT, parseJWT } from "oslo/jwt"
import { TimeSpan } from "oslo"
import prisma from "./db"

const SECRET_KEY = process.env.JWT_SECRET || "secret"

const getEncodedSecret = async (): Promise<ArrayBuffer> => {
    if (!SECRET_KEY) throw new Error("Secret token is not defined")

    return new TextEncoder().encode(SECRET_KEY).buffer as ArrayBuffer
}

// Create token
const createToken = async (
    userId: string,
    expiresIn: TimeSpan
): Promise<string> => {
    const secret = await getEncodedSecret()
    const options = {
        subject: userId,
        expiresIn,
        includeIssuedTimestamp: true,
    }

    return await createJWT("HS256", secret, {}, options)
}

// Create an access JWT token with 1 day expiration time.
export const createAccesToken = async (
    userId: string,
    expiresInMinute: number = 1440
) => {
    try {
        return await createToken(userId, new TimeSpan(expiresInMinute, "m"))
    } catch (error) {
        throw new Error("Failed to create acces token")
    }
}

// Validates a given token
export const validateToken = async (token: string) => {
    try {
        const secretKey = await getEncodedSecret()
        return await validateJWT("HS256", secretKey, token)
    } catch (error) {
        throw new Error("Token invalid")
    }
}

// Create Refresh Token
export const createRefreshToken = async (
    userId: string,
    expiresInDay: number = 14
): Promise<String> => {
    try {
        const issuedAt = new Date()
        // Create expired date
        const expiresAt = new Date(
            issuedAt.getTime() + expiresInDay * 24 * 60 * 60 * 1000
        )

        const tokenExpiry = new TimeSpan(expiresInDay, "d")
        const refreshToken = await createToken(userId, tokenExpiry)

        await prisma.userToken.create({
            data: {
                userId,
                token: refreshToken,
                issuedAt,
                expiresAt,
            },
        })

        return refreshToken
    } catch (error) {
        throw new Error("Failed to create refresh token.", { cause: error })
    }
}
