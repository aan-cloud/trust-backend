import { serve } from "bun";
import { apiReference } from "@scalar/hono-api-reference";
import { cors } from "hono/cors";
import WelcomePage from "./Welcome";
import authRoute from "./routes/auth.js";
import productRoute from "./routes/product";
import cartRoute from "./routes/cart";
import checkoutRoute from "./routes/checkout";
import { OpenAPIHono } from "@hono/zod-openapi";

const app = new OpenAPIHono();

app.use("*", cors());

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
// app.route("/users", userRoute);
app.route("/checkout", checkoutRoute)
app.route("/auth", authRoute);
app.route("/cart", cartRoute)

const port = process.env.PORT || 3000;
console.log(`Server is running on port ${port}`);

serve({
    fetch: app.fetch,
    port,
});
