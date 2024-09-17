import { Hono } from "hono";
import ProductServices from "../services/product";

const services = new ProductServices();
const productRoutes = new Hono();

productRoutes.get('/products', (c) => {
    const data = services.getAllProduct();
    return c.json({
        message: "succes",
        data: data
    })
});

productRoutes.get('/products/:id', (c) => {
    const id = c.req.param('id');
    const data = services.getProductById(id);

    return c.json({
        message: "succes",
        data: data
    });
});

export default productRoutes;