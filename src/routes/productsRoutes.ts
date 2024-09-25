import { Hono } from "hono";
import ProductServices from "../services/product";
import { data_products } from "../seed/products";

const services = new ProductServices();
const productRoutes = new Hono();

productRoutes.get("/", async (c) => {
  const data = await services.getAllProducts();

  return c.json(
    {
      message: "succes",
      data: data,
    },
    200,
  );
});

productRoutes.get("/:slug", async (c) => {
  const slug = c.req.param("slug")
  const data = await services.getProductsSlug(slug);

  return c.json({
    message: "succes get products slug",
    data: data
  }, 200);
});

productRoutes.get("/:categories", async (c) => {
  const categories = c.req.param("categories");
  const data = await services.getCategories(categories);

  return c.json({
    message: "succes get categories",
    data: data
  }, 200)
});

productRoutes.get("/:categories/:slug", async (c) => {
  const categories = c.req.param("categories");
  const slug = c.req.param("slug");
  const data = await services.getCategoriesSlug(categories,slug);

  return c.json({
    message: `Succes get product ${categories} ${slug ? " " + slug : ""}`,
    data: data,
  });
});

productRoutes.delete("/", async (c) => {
  const deletedData = await services.deleteAllProducts();

  return c.json({
    message: `succes deleted ${deletedData.count} data`,
    data: deletedData,
  });
});

productRoutes.delete("/:slug", async (c) => {
  const slug = c.req.param("slug");
  const data = await services.deleteProductsBySlug(slug);

  return c.json(
    {
      message: `succes deleted ${slug}`,
      data: data,
    },
    200,
  );
});

productRoutes.post("/seed", async (c) => {
  const postedData = await services.postSeedProducts(data_products);

  return c.json({
    message: "succes add seed item",
    data: postedData,
  });
});

productRoutes.post("/", async (c) => {
  const reqdata = await c.req.json();
  const postedData = await services.postProducts(reqdata);

  return c.json(
    {
      message: "add item succes",
      data: postedData,
    },
    200,
  );
});

export default productRoutes;
