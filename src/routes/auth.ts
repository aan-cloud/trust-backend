import { OpenAPIHono } from "@hono/zod-openapi";
import { Context } from "hono";
import * as authServices from "../services/auth";
import * as authSchema from "../schemas/auth.schema";
import authMiddleware from "../middlewares/check-user-token";
import { authorizationUrl } from "../libs/oauth";

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
    async (c) => {
        const body = c.req.valid("json");

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
        } catch (error: Error | any) {
            return c.json(
                { message: "failed to get profile", error: error.message },
                401
            );
        }
    }
);

authRoute.openapi(
    {
        method: "post",
        path: "/refresh-token",
        summary: "Refresh access token",
        description: "Get the refresh token and access token",
        tags: TAGS,
        security: [{ AuthorizationBearer: [] }],
        middleware: [authMiddleware],
        request: {
            body: {
                content: {
                    "application/json": {
                        schema: authSchema.refreshSchema,
                    },
                },
            },
        },
        responses: {
            200: {
                description: "Token successfully retrieved",
            },
            401: {
                description: "Refresh token is missing or invalid",
            },
        },
    },
    async (c: Context) => {
        const { refreshToken } = await c.req.json();

        try {
            const newToken = await authServices.regenToken(refreshToken);

            return c.json(newToken, 201);
        } catch (error: Error | any) {
            return c.json({ error: error.message }, error.status || 401);
        }
    }
);

authRoute.openapi(
    {
        method: "post",
        path: "/logout",
        summary: "Logout from your account",
        description: "Logout from your account, then delete the refresh token",
        tags: TAGS,
        security: [{ AuthorizationBearer: [] }],
        middleware: [authMiddleware],
        request: {
            body: {
                content: {
                    "application/json": {
                        schema: authSchema.refreshSchema,
                    },
                },
            },
        },
        responses: {
            200: {
                description: "Logout Success",
            },
            401: {
                description: "Refresh token is missing or invalid",
            },
        },
    },
    async (c: Context) => {
        const { refreshToken } = await c.req.json();

        try {
            const logedOut = await authServices.logOut(refreshToken);
            return c.json({ isLogedOut: logedOut }, 200);
        } catch (error: Error | any) {
            return c.json({ error: error.message }, error.status || 404);
        }
    }
);

authRoute.openapi(
    {
        method: "patch",
        path: "/change-password",
        summary: "Change password",
        description: "Change password without old password",
        tags: TAGS,
        security: [{ AuthorizationBearer: [] }],
        middleware: [authMiddleware],
        request: {
            body: {
                content: {
                    "application/json": {
                        schema: authSchema.changePasswordSchema,
                    },
                },
            },
        },
        responses: {
            200: {
                description: "Password succesfully changed",
            },
            401: {
                description: "Invalid Password, Username, and Email",
            },
            500: {
                description: "Server error",
            },
        },
    },
    async (c: Context) => {
        const request = await c.req.json();
        console.log(request);
        try {
            const newPassword = await authServices.changePassword(request);
            return c.json(newPassword, 201);
        } catch (error: Error | any) {
            return c.json({ error: error.message }, error.status || 404);
        }
    }
);

authRoute.openapi(
    {
        method: "get",
        path: "/google",
        summary: "Google Oauth Login",
        description:
            "This route is not fully supported by Swagger UI because it involves a redirect to a Google URL. This route only supports testing in the browser. You can copy the URL to the browser, and log in with your Google account.",
        tags: TAGS,
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
        return c.redirect(authorizationUrl);
    }
);

authRoute.openapi(
    {
        method: "get",
        path: "/google/callback",
        summary: "Calback of Google Oauth",
        description:
            "After the /auth/google route is executed, you will be redirected to this route. This route is responsible for providing the success or failure status of obtaining user information from their Google account. When successful, a token will be generated.",
        tags: TAGS,
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
        const query = c.req.query("code");

        if (!query) {
            throw new Error(
                "Failed to get User information or Google code is invalid"
            );
        }

        try {
            const userData = await authServices.googleAuthCallback(query);

            if (!userData) {
                c.json({ messsage: userData }, 401);
            }

            return c.json(userData);
        } catch (error: Error | any) {
            return c.json({ error: error.message }, error.status || 404);
        }
    }
);

authRoute.openapi(
    {
        method: "patch",
        path: "/register/seller",
        summary: "Switched role to seller",
        tags: TAGS,
        security: [{ AuthorizationBearer: [] }],
        middleware: [authMiddleware],
        request: {
            body: {
                content: {
                    "application/json": {
                        schema: authSchema.sellerRegisterSchema,
                    },
                },
            },
        },
        responses: {
            201: {
                description: "Swited to seller successfully",
            },
            400: {
                description: "Switched to seller failed",
            },
        },
    },
    async (c: Context) => {
        const body = await c.req.json();

        body.userId = c.get("user").id;

        console.log(body);

        try {
            const switchedRole = await authServices.registerSeller(body);
            return c.json(switchedRole, 201);
        } catch (error: Error | any) {
            const errorMessage =
                error instanceof Error ? error.message : "Unknown error";
            return c.json(
                { message: "Switced to seller failed", error: errorMessage },
                400
            );
        }
    }
);

export default authRoute;
