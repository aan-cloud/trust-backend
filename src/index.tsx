import { serve } from "bun";
import { apiReference } from "@scalar/hono-api-reference";
import { cors } from "hono/cors";
import "./routes/products.route.ts";
import WelcomePage from "./Welcome";
import productRoutes from "./routes/products.route.ts";
import categoriesRoute from "./routes/categories.route";
import userRoute from "./routes/users.route";
import authRoute from "./routes/auth.route";
import cartRoute from "./routes/cart.route";
import { OpenAPIHono } from "@hono/zod-openapi";

const app = new OpenAPIHono();

app.use("*", cors());

app.get("/", async (c) => {
  return await c.html(
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <link rel="icon" type="image/svg+xml" href="/trust-logo.png" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
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
    </html>,
  );
});

app.get(
  "/ui",
  apiReference({
    pageTitle: "CheckCafe API Reference",
    spec: {
      url: "/openapi.json",
    },
  }),
);

app.doc("/openapi.json", {
  openapi: "3.1.0",
  info: {
    version: "1.0.0",
    title: "CheckCafe API",
    description: "API for CheckCafe project.",
  },
});

// API route
app.route("/products", productRoutes);
app.route("/categories", categoriesRoute);
app.route("/users", userRoute);
app.route("/auth", authRoute);
app.route("/cart", cartRoute);

const port = process.env.PORT || 3000;
console.log(`Server is running on port ${port}`);

serve({
  fetch: app.fetch,
  port,
});
