import { Hono } from "hono";
import UserServices from "../services/users.services";

const userRoute = new Hono();
const userservice = new UserServices();

userRoute.get("/", async (c) => {
  const users = await userservice.getAlluser();
  return c.json({
    message: "succes get all users",
    data: users,
  });
});

userRoute.get("/:username", async (c) => {
  const param = c.req.param("username");
  const username = await userservice.getUsername(param);

  return c.json({
    message: "succes get username",
    data: username,
  });
});

export default userRoute;
