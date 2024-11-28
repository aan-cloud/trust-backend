import { OpenAPIHono, createRoute, z } from "@hono/zod-openapi";
import { Context } from "hono";
import * as authServices from "../services/auth.service";
import * as authSchema from "../schemas/auth.schema";
import authMiddleware from "../middlewares/check-user-token";

const authRoute = new OpenAPIHono();

const TAGS = ["Auth"];

authRoute.openAPIRegistry.registerComponent(
    "securitySchemes",
    "AuthorizationBearer",
    {
        type: "http",
        scheme: "bearer",
        in: "header",
        description: "Bearer token",
    }
);

authRoute.openapi(
    {
        method: "post",
        path: "/register",
        summary: "Register User",
        tags: TAGS,
        request: {
            body: {
                content: {
                    "application/json": {
                        schema: authSchema.registerSchema,
                    },
                },
            },
        },
        responses: {
            201: {
                description: "Register success",
                // content: {
                //   'application/json': {
                //     schema: z.object({
                //       message: z.string(),
                //       data: z.any()
                //     }),
                //   },
                // },
            },
            400: {
                description: "Register failed",
                // content: {
                //   'application/json': {
                //     schema: z.object({
                //       message: z.string(),
                //       error: z.string(),
                //     }),
                //   },
                // },
            },
        },
    },
    async (c: Context) => {
        const body = await c.req.json();

        try {
            const registeredUser = await authServices.register(body);
            return c.json(registeredUser, 201);
        } catch (error: Error | any) {
            const errorMessage =
                error instanceof Error ? error.message : "Unknown error";
            return c.json(
                { message: "register failed", error: errorMessage },
                400
            );
        }
    }
);

authRoute.openapi(
    {
        method: "post",
        path: "/login",
        summary: "Login User",
        tags: TAGS,
        request: {
            body: {
                content: {
                    "application/json": {
                        schema: authSchema.loginSchema,
                    },
                },
            },
        },
        responses: {
            201: {
                description: "Register success",
            },
            400: {
                description: "Register failed",
            },
        },
    },
    async (c: Context) => {
        const userData = await c.req.json();

        try {
            const logedData = await authServices.login(userData);
            return c.json(logedData, 200);
        } catch (error: Error | any) {
            return c.json(
                { message: "Login failed", error: error.message },
                401
            );
        }
    }
);

authRoute.openapi(
    {
        method: "get",
        path: "/me",
        summary: "User information",
        description:
            "Get logged in user information including user ID, username, and role.",
        tags: TAGS,
        security: [{ AuthorizationBearer: [] }],
        middleware: [authMiddleware],
        responses: {
            200: {
                description: "User information successfully retrieved",
            },
            401: {
                description: "Refresh token is missing or invalid",
            },
        },
    },
    async (c: Context) => {
        const userId = (c as Context).get("user")?.id as string;

        try {
            const user = await authServices.profile(userId);
            return c.json({ message: "succes get profile", user }, 200);
        } catch (error) {
            return c.json({ message: "failed to get profile" }, 401);
        }
    }
);

export default authRoute;
