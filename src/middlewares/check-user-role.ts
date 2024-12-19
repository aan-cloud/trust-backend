import { Context } from "hono";
import { createMiddleware } from "hono/factory";
import { extractToken, respondWithError } from "./check-user-token";
import { validateToken } from "../libs/jwt";
import prisma from "../libs/db";

const hasRole = (userRoles: string[], requiredRole: string) => {
    return userRoles.includes(requiredRole);
};

export const checkUserRole = createMiddleware(async (c: Context, next) => {
        const token = extractToken(c.req.header("Authorization"));

        if (!token) {
            return respondWithError(c, "Authorization token is required!", 401);
        }

        try {
            const decodedToken = await validateToken(token);
            const userId = decodedToken?.subject;

            if (!userId || typeof userId !== "string" || userId.length === 0) {
                return respondWithError(c, "Invalid user ID in token!", 401);
            }

            const user = await prisma.user.findUnique({
                where: { id: userId },
                select: {
                    id: true,
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

            if (!user) {
                return respondWithError(c, "User not found!", 404);
            }

            const checkRole = hasRole(
                user.roles.map((role) => role.role.roleName),
                "SELLER"
            );

            if (!checkRole) {
                return respondWithError(
                    c,
                    "Access denied, User is not authorized as a seller",
                    401
                );
            }

            c.set("user", {
                id: user.id,
            });

            c.set("role", {
                role: user.roles,
            });

            await next();
        } catch (error: Error | any) {
            return respondWithError(
                c,
                `Authentication failed ${error.message}`,
                401
            );
        }
    });
