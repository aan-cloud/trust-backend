import { createMiddleware } from "hono/factory";
import { getCookie } from "hono/cookie";

import prisma from "../lib/db";
import { validateToken } from "../lib/jwt";

type Env = {
  Variables: {
    user:
      | {
          id: string;
        }
      | any;
  };
};

export const checkUserToken = createMiddleware<Env>(async (c, next) => {
  const tokenCookie = getCookie(c, "token");
  const authHeader = c.req.header("Authorization");

  // Get the token from cookies or header
  const token = tokenCookie
    ? tokenCookie
    : authHeader
      ? authHeader.split(" ")[1]
      : null;

  if (!token) {
    return c.json({ message: "Not allowed token is required" }, 404);
  }

  const decodedToken = await validateToken(token);

  if (!decodedToken) {
    return c.json({ message: "Not allowed. Token is invalid" }, 401);
  }

  const userId = decodedToken.subject;

  if (!userId) {
    return c.json({ message: "user ID is not don't exist" }, 401);
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true },
  });

  c.set("user", user);

  await next();
});
