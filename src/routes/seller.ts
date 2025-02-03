import { OpenAPIHono } from "@hono/zod-openapi";

import * as sellerServices from "../services/seller";
import * as sellerSchema from "../schemas/seller"
import { checkUserRole } from "../middlewares/check-user-role";
import authMiddleware from "../middlewares/check-user-token";
import { Context } from "hono";


const sellerRoute = new OpenAPIHono();

const TAGS = ["Seller"];


sellerRoute.openapi(
    {
        method: "get",
        path: "/{sellerId}/dashboard",
        summary: "Seller Dashboard",
        description:
            "Get seller dashboard information",
        tags: TAGS,
        security: [{ AuthorizationBearer: [] }],
        middleware: [authMiddleware, checkUserRole],
        request: { params: sellerSchema.sellerIdParam, },
        responses: {
            200: {
                description: "User information successfully retrieved",
            },
            401: {
                description: "Refresh token is missing or invalid",
            },
        },
    },
    async (c) => {
        const userId = (c as Context).get("user")?.id as string;

        try {
            const sellerProduct = await sellerServices.getSellerDashboard(userId);

            return c.json(sellerProduct, 200);
        } catch (error: Error | any) {
            return c.json(error, 400);
        }
    }    
)

export default sellerRoute;