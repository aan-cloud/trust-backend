import { Hono } from "hono";
import dataDummy from "../data";

const usersRoutes = new Hono();

usersRoutes.get("/", (c) => {
    return c.json({
        message: "succes",
        data: dataDummy
    })
});

export default usersRoutes;