import { Hono } from "hono";
import ProductServices from "../services/product";

const services = new ProductServices();
const productRoutes = new Hono();

productRoutes.get("/", async (c) => {
  const data = await services.getAllProduct();

  return c.json(
    {
      message: "succes",
      data: data,
    },
    200,
  );
});

productRoutes.get("/:slug", async (c) => {
  const slug = c.req.param("slug");
  const data = await services.getProductName(slug);

  return c.json(
    {
      message: `succes get ${slug}`,
      data: data,
    },
    200,
  );
});

productRoutes.get("/:slug", async (c) => {
  const slug = c.req.param("slug");
  const data = await services.deleteProductBySlug(slug);

  return c.json(
    {
      message: `succes deleted ${slug}`,
      data: data,
    },
    200,
  );
});

productRoutes.post("/", async (c) => {
  const reqdata = await c.req.json();
  const postedData = await services.postProduct(reqdata);

  return c.json(
    {
      message: "add item succes",
      data: postedData,
    },
    200,
  );
});

export default productRoutes;
