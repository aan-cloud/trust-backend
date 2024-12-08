import prisma from "../libs/db";
import { redis } from "../libs/db";
import {
    loginSchema,
    registerSchema,
    changePasswordSchema,
    sellerRegisterSchema
} from "../schemas/auth.schema";
import { z } from "zod";
import * as crypto from "../libs/crypto";
import * as jwt from "../libs/jwt";
import { google } from "googleapis";
import { oauth2Client } from "../libs/oauth"

type RegisterSchema = z.infer<typeof registerSchema>;
type LoginSchema = z.infer<typeof loginSchema>;
type ChangePasswordSchema = z.infer<typeof changePasswordSchema>;
type SellerRegisterSchema = z.infer<typeof sellerRegisterSchema>

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
                roles: {
                    select: {
                        roleId: true
                    }
                }
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

export const profile = async (id: string) => {
    // Inline caching tecnique
    const isUserCached = await redis.get(id);

    if (!isUserCached) {
        const user = await prisma.user.findUnique({
            where: { id },
            select: {
                roles: {
                    select: {
                        role: {
                            select: {
                                roleName: true
                            }
                        }
                    }
                },
                username: true,
                email: true,
                id: true,
            },
        });
        await redis.setex(id, 3600, JSON.stringify(user));
        return user;
    }

    return JSON.parse(isUserCached);
};

export const regenToken = async (refreshToken: string): Promise<any> => {
    return await processToken(refreshToken, true);
};

export const changePassword = async (userData: ChangePasswordSchema) => {
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

    await prisma.user.update({
        data: {
            password: newPassword,
        },
        where: {
            username: userData.userName,
            email: userData.email,
        },
    });

    return {
        message: "Success changed password",
    };
};

export const logOut = async (refreshToken: string) => {
    return await processToken(refreshToken);
};

export const googleAuthCallback = async (code: string) => {
        const { tokens } = await oauth2Client.getToken(code);

        oauth2Client.setCredentials(tokens);

        const oauth2 = google.oauth2({
            auth: oauth2Client,
            version: 'v2'
        });

        const { data } = await oauth2.userinfo.get();

        if(!data.email || !data.name || !data.id) {
            throw new Error("Failed get google user data");
        }

        let existingUser = await prisma.user.findUnique({
            where: {
                email: data.email
            }
        });

        const role = await prisma.role.findFirst({
            where: {
                roleName: "USER"
            }
        });

        if (!existingUser) {
            existingUser = await prisma.user.create({
                data: {
                    email: data.email,
                    username: data.name,
                    password: data.id,
                    roles: {
                        create: {
                            role: {
                                connect: {
                                    id: role?.id
                                }
                            }
                        }
                    }
                }
            });
            const [accessToken, refreshToken] = await Promise.all([
                jwt.createAccesToken(existingUser.id),
                jwt.createRefreshToken(existingUser.id),
            ]);
    
            return {
                email: existingUser.email,
                userName: existingUser.username,
                accessToken,
                refreshToken
            };
        };

        return {
            message: "User Already"
        }
};

export const registerSeller = async (userData: SellerRegisterSchema) => {
    return await prisma.$transaction(async (db) => {
        const checkUser = await db.user.findFirst({
            where: {
                id: userData.userId
            }
        });
    
        if(!checkUser) {
            throw new Error("User not found!")
        }
    
        let role = await db.role.findFirst({
            where: { roleName: userData.switchToRole}
        });
    
        if (!role) {
            role = await db.role.create({
                data: {
                    roleName: userData.switchToRole,
                    description: userData.description,
                }
            });
        }
    
        await db.userRole.upsert({
            where: {
                userId_roleId: {
                    userId: userData.userId,
                    roleId: role.id,
                },
            },
            update: {
                roleId: role.id,
            },
            create: {
                userId: userData.userId,
                roleId: role.id,
            },
        });
    
        const updatedUser = await db.user.update({
            where: { id: userData.userId },
            data: {
                avatarUrl: userData.avatarUrl,
                description: userData.description
            },
            select: {
                id: true,
                username: true,
                email: true,
                description: true,
                avatarUrl: true,
                createdAt: true,
                updatedAt: true
            }
        });
    
        return {
            message: "Switched to seller was successfully",
            updatedUser
        };
    });
}
