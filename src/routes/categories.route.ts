import { Hono } from "hono";
import CategoriesServices from "../services/categories.service";

const services = new CategoriesServices();
const categoriesRoute = new Hono();

categoriesRoute.get("/:category", async (c) => {
    const category = c.req.param("category");
    const data = await services.getCategories(category);

    if (!data.length) {
        return c.json({
            message: "error get categories",
            data: data
        }, 404);
    };

    return c.json({
        message: "succes get categories product",
        data: data
    }, 200);
});

categoriesRoute.get("/:category/:slug", async (c) => {
    const slug = c.req.param("slug");
    const category = c.req.param("category");
    const data = await services.getCategiesSlug(slug,category);

    return c.json({
        message: "succes get categories slug",
        data: [data]
    }, 200);
});

export default categoriesRoute;