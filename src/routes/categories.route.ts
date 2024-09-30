import { Hono } from "hono";
import CategoriesServices from "../services/categories.service";

const services = new CategoriesServices();
const categoriesRoute = new Hono();

categoriesRoute.get("/", async (c) => {
  const category = c.req.param("category");

  if (!category) {
    const categories = await services.getCategories();
    return c.json(
      {
        message: "succes get categories",
        data: categories,
      },
      200
    );
  };

  const searchCategory = services.searchcategory(category);

  return c.json(
    {
      message: "succes get category",
      data: searchCategory,
    },
    200
  );
});

categoriesRoute.get("/:slug", async (c) => {
  const slug = c.req.param("slug");
  const category = await services.getCategoryBySlug(slug);

  if (!category) {
    return c.json(
      {
        message: "error get category by slug",
        data: category,
      },
      404
    );
  }

  return c.json(
    {
      message: "succes get category slug, including products",
      data: category,
    },
    200
  );
});

export default categoriesRoute;
