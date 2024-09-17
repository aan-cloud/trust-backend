import { Hono } from "hono";
import "./config/swagger";
import productRoutes from "./routes/productsRoutes";

const app = new Hono();

app.get("/", async (c) => {
  return await c.html(<h1>Ini swagger nanti nya</h1>);
});

app.route('/products', productRoutes);

export default app;