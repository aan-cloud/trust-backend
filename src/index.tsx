import { serve } from "bun";
import { swaggerUI } from "@hono/swagger-ui";
import { cors } from "hono/cors";
import { registerSwaggerEndpoint } from "./config/swagger";
import "./routes/products.route.ts";
import { Hono } from "hono";
import "./config/swagger";
import WelcomePage from "./Welcome";
import productRoutes from "./routes/products.route.ts";
import categoriesRoute from "./routes/categories.route";
import userRoute from "./routes/users.route";
import authRoute from "./routes/auth.route";

const app = new Hono();

app.use(cors());

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

registerSwaggerEndpoint(app);
app.get("/ui", swaggerUI({ url: "/api-spec" }));

// API route
app.route("/products", productRoutes);
app.route("/categories", categoriesRoute);
app.route("/users", userRoute);
app.route("/auth", authRoute);

const port = process.env.PORT || 3000;
console.log(`Server is running on port ${port}`);

serve({
  fetch: app.fetch,
  port,
});
