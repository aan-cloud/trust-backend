import { Hono } from "hono";
import ProductServices from "../services/product";
import { data_products } from "../seed/products";

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

productRoutes.delete("/:slug", async (c) => {
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

productRoutes.post("/seed", async(c) => {
  const postedData = await services.postSeedProduct(data_products);

  return c.json({
    message: "succes add seed item",
    data: postedData
  });
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
