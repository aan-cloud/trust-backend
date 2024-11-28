import { Bcrypt } from "oslo/password"

const saltRounds = parseInt(process.env.SALT_ROUNDS || "10")
const bcrypt = new Bcrypt({ cost: saltRounds })

export async function hashValue(password: string): Promise<string> {
    try {
        return await bcrypt.hash(password)
    } catch (error) {
        throw new Error("Failed to hash password")
    }
}

export async function verifyvalue(
    value: string,
    hashedValue: string | any
): Promise<boolean> {
    try {
        return await bcrypt.verify(hashedValue, value)
    } catch (error) {
        throw new Error("Failed to verify")
    }
}
