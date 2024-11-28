import prisma from "../libs/db";
import { redis } from "../libs/db";
import {
    loginSchema,
    registerSchema,
    changePasswordSchema,
} from "../schemas/auth.schema";
import { z } from "zod";
import * as crypto from "../libs/crypto";
import * as jwt from "../libs/jwt";

type RegisterSchema = z.infer<typeof registerSchema>;
type LoginSchema = z.infer<typeof loginSchema>;
type ChangePasswordSchema = z.infer<typeof changePasswordSchema>;

const processToken = async (
    refreshToken: string,
    isGenerated: boolean = false
) => {
    const isTokenExist = await prisma.userToken.findFirst({
        where: { token: refreshToken, expiresAt: { gte: new Date() } },
    });

    if (!isTokenExist) {
        throw new Error("Token is Invalid or expired!");
    }

    await prisma.userToken.delete({
        where: { id: isTokenExist.id },
    });

    if (isGenerated) {
        const [accessToken, refreshToken] = await Promise.all([
            jwt.createAccesToken(isTokenExist.userId),
            jwt.createRefreshToken(isTokenExist.userId),
        ]);

        return { accessToken, refreshToken };
    }

    return true;
};

export const register = async (userData: RegisterSchema) => {
    return await prisma.$transaction(async (db) => {
        const existingUser = await db.user.findFirst({
            where: {
                OR: [
                    {
                        username: userData.username,
                    },
                    {
                        email: userData.email,
                    },
                ],
            },
        });

        if (existingUser) {
            throw new Error("Email or Username already registered!");
        }

        let role = await db.role.findFirst({
            where: {
                roleName: "USER",
            },
        });

        if (!role) {
            role = await db.role.create({
                data: {
                    roleName: "USER",
                    description: "This role can be buyer only",
                },
            });
        }

        const hashedPassword = await crypto.hashValue(userData.password);

        return await db.user.create({
            data: {
                username: userData.username,
                password: hashedPassword,
                email: userData.email,
                roles: {
                    create: {
                        roleId: role.id,
                    },
                },
            },
            select: {
                id: true,
                username: true,
                email: true,
                roles: true,
            },
        });
    });
};

export const login = async (userData: LoginSchema) => {
    const existingUser = await prisma.user.findUnique({
        where: {
            username: userData.username,
        },
        select: {
            id: true,
            password: true,
            username: true,
            roles: {
                select: {
                    role: {
                        select: {
                            roleName: true,
                        },
                    },
                },
            },
        },
    });

    const verifyPassword = await crypto.verifyvalue(
        userData.password,
        existingUser?.password
    );

    if (!existingUser || !verifyPassword) {
        throw Error(
            "User not found, input the correct email and password or register first"
        );
    }

    const [accessToken, refreshToken] = await Promise.all([
        jwt.createAccesToken(existingUser.id),
        jwt.createRefreshToken(existingUser.id),
    ]);

    return {
        username: existingUser.username,
        accesToken: accessToken,
        refreshToken: refreshToken,
        roles: existingUser.roles,
    };
};
// Ambil id user dari token nya
export const profile = async (id: string) => {
    const user = await prisma.user.findUnique({
        where: { id },
        select: {
            roles: true,
            username: true,
            email: true,
            id: true,
        },
    });
    // await redis.setex(id, 3600, JSON.stringify(user))
    return user;
};

export const regenToken = async (refreshToken: string): Promise<any> => {
    return await processToken(refreshToken, true);
};

export const changePassword = async ({
    userData,
}: {
    userData: ChangePasswordSchema;
}) => {
    const user = await prisma.user.findUnique({
        where: {
            username: userData.userName,
            email: userData.email,
        },
    });

    if (!user) {
        throw new Error(
            "User not found. Can't change password, please enter the correct email and username"
        );
    }

    const newPassword = await crypto.hashValue(userData.newPassword);

    const updatedPassword = await prisma.user.update({
        data: {
            password: newPassword,
        },
        where: {
            username: userData.userName,
            email: userData.email,
        },
    });

    return updatedPassword;
};

export const logOut = async (refreshToken: string) => {
    return await processToken(refreshToken);
};
