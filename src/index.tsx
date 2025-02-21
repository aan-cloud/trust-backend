import { serve } from "bun";
import { apiReference } from "@scalar/hono-api-reference";
import { cors } from "hono/cors";
import WelcomePage from "./Welcome";
import authRoute from "./routes/auth.js";
import productRoute from "./routes/product";
import cartRoute from "./routes/cart";
import checkoutRoute from "./routes/checkout";
import webHookRoutes from "./routes/webhook";
import { OpenAPIHono } from "@hono/zod-openapi";
import sellerRoute from "./routes/seller";
import transactionRoute from "./routes/transaction";

const app = new OpenAPIHono();
// Cors
app.use("/*", cors());
// Logging
app.use('*', async (c, next) => {
    console.log(`Request: ${c.req.method} ${c.req.url}`);
    await next();
    console.log(`Response Status: ${c.res.status}`);
});

app.get("/", async (c) => {
    return await c.html(
        <html lang="en">
            <head>
                <meta charset="UTF-8" />
                <link rel="icon" type="image/svg+xml" href="/trust-logo.png" />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1.0"
                />
                <title>Welcome to Trust API</title>
                <meta
                    name="description"
                    content="Trust help you find quality automotive goods, directly from the manufacturer."
                />
                <script src="https://cdn.tailwindcss.com"></script>
            </head>
            <body>
                <WelcomePage />
            </body>
        </html>
    );
});
// Scalar 
app.get(
    "/ui",
    apiReference({
        pageTitle: "Trust API Reference",
        spec: {
            url: "/openapi.json",
        },
    })
);

app.doc("/openapi.json", {
    openapi: "3.1.0",
    info: {
        version: "1.0.0",
        title: "Trust API",
        description: "API for Trust project.",
    },
});

// API route
app.route("/products", productRoute);
// app.route("/categories", categoriesRoute);
app.route("/transaction", transactionRoute);
app.route("/webhook", webHookRoutes);
app.route("/seller", sellerRoute);
app.route("/checkout", checkoutRoute);
app.route("/auth", authRoute);
app.route("/cart", cartRoute);

const port = process.env.PORT || 3000;
console.log(`Server is running on port ${port}`);

serve({
    fetch: app.fetch,
    port,
});
