import { serve } from 'bun';
import { swaggerUI } from "@hono/swagger-ui";
import { registerSwaggerEndpoint } from "./config/swagger";
import "./routes/productsRoutes";
import { Hono } from "hono";
import "./config/swagger";
import WelcomePage from './Welcome';
import productRoutes from "./routes/productsRoutes";

const app = new Hono();

app.get("/", async (c) => {
  return await c.html(
     <html lang="en">
      <head>
        <meta charset="UTF-8" />
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
    </html>
  );
});


registerSwaggerEndpoint(app);
app.get("/ui", swaggerUI({url:'/api-spec'}));


app.route('/products', productRoutes);


const port: number = 3000;
console.log(`Server is running on port ${port}`);

serve({
  fetch: app.fetch,
  port
});