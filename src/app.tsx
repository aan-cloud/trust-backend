import { Hono } from "hono";
import usersRoutes from "./routes/productsRoutes";
import { swaggerUI } from "@hono/swagger-ui";

const app = new Hono();

app.get("/", async (c) => {
  return await c.html(<h1>Ini swagger nanti nya</h1>);
});

app.get("/ui", swaggerUI({url: '/doc'}))

app.route("/products", usersRoutes);

export default app;