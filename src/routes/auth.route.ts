import { OpenAPIHono, createRoute, z } from "@hono/zod-openapi";
import { Context } from "hono";
import AuthServices from "../services/auth.service";
import * as authSchema from "../schemas/auth.schema";

import { checkUserToken } from "../middlewares/check-user-token";

const authRoute = new OpenAPIHono();
const authService = new AuthServices();

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
  createRoute({
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
  }),
  async (c: Context) => {
    const userData = await c.req.json();

    try {
      const registeredUser = await authService.register(userData);
      return c.json({ message: "register success", data: registeredUser }, 201);
    } catch (error: Error | any) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      return c.json({ message: "register failed", error: errorMessage }, 400);
    }
  },
);

authRoute.openapi(
  createRoute({
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
        content: {
          'application/json': {
            schema: authSchema.ResponseSuccess,
          },
        },
      },
      400: {
        description: "Register failed",
      },
    },
  }),
  async (c: Context) => {
    const userData = await c.req.json();
  
    try {
      const token = await authService.login(userData);
      return c.json({
        message: "login succes",
        token: token
      });
    } catch (error: Error | any) {
      return c.json({ message: "Login failed", error: error.message }, 401);
    }
  }
)

authRoute.openapi(
  createRoute({
    method: "get",
    path: "/me",
    summary: "User information",
    description:
      "Get logged in user information including user ID, username, and role.",
      tags: TAGS,
    security: [{ AuthorizationBearer: [] }],
    middleware: [checkUserToken],
    responses: {
      200: {
        description: "User information successfully retrieved",
      },
      401: {
        description: "Refresh token is missing or invalid",
      },
    },
  }),
  async (c) => {
    const jwtToken = c.req.header("Authorization")?.replace("Bearer ", "").trim();
  
    if (!jwtToken) {
      return c.json({ message: "User not defined" }, 401);
    }
  
    try {
      const user = await authService.profile(jwtToken);
      return c.json({ message: "succes get profile", user }, 200);
    } catch (error) {
      return c.json({ message: "failed to get profile" }, 401);
    }
  }
)

export default authRoute;
