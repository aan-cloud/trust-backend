import { Hono } from "hono";
import ProductServices from "../services/product.service";

const services = new ProductServices();
const productRoutes = new Hono();

productRoutes.get("/", async (c) => {
    const query = c.req.query("name");

    if (!query) {
        const allProduct = await services.getAllProducts();
        return c.json(
            {
                message: "succes",
                data: allProduct,
            },
            200
        );
    }

    const productByQuery = await services.searchProduct(query);

    return c.json({
        message: "succes get search products",
        data: productByQuery,
    });
});

productRoutes.get("/:slug", async (c) => {
    const slug = c.req.param("slug");
    const data = await services.getProductsSlug(slug);

    return c.json(
        {
            message: "succes get products slug",
            data: data,
        },
        200
    );
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
        200
    );
});

productRoutes.post("/", async (c) => {
    const reqdata = await c.req.json();
    const postedData = await services.postProducts(reqdata);

    return c.json(
        {
            message: "add item succes",
            data: postedData,
        },
        200
    );
});

export default productRoutes;
