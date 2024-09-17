import { serve } from 'bun';
import app from "./app";
import { swaggerUI } from "@hono/swagger-ui";
import { registerSwaggerEndpoint } from "./config/swagger";
import "./routes/productsRoutes";

registerSwaggerEndpoint(app);

app.get("/swagger", swaggerUI({url:'/api-doc'}));


const port: number = 3000;
console.log(`Server is running on port ${port}`);

serve({
  fetch: app.fetch,
  port
});