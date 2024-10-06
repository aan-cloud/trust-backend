import { Hono } from "hono";
import AuthServices from "../services/auth.service";

const authRoute = new Hono();
const authService = new AuthServices();

authRoute.post("/register", async (c) => {
  const userData = await c.req.json();

  try {
    const registeredUser = await authService.register(userData);
    return c.json({ message: "register succes", data: registeredUser }, 201);
  } catch (error: any) {
    return c.json({ message: "register failed", error: error.message }, 400);
  }
});

authRoute.post("/login", async (c) => {
  const userData = await c.req.json();

  try {
    const token = await authService.login(userData);
    return c.json({
      message: "login succes",
      data: token,
    });
  } catch (error: any) {
    return c.json({ message: "Login failed", error: error.message }, 401);
  }
});

authRoute.get("/me", async (c) => {
  const jwtToken = c.req.header("Authorization")?.replace("Bearer", "");

  if (!jwtToken) {
    return c.json({ message: "User not defined" }, 401);
  }

  try {
    const user = await authService.profile(jwtToken);
    return c.json({ message: "succes get profile", data: user }, 200);
  } catch (error) {
    return c.json({ message: "failed to get profile" }, 401);
  }
});

export default authRoute;
