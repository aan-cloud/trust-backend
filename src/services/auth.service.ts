import prisma from "../lib/db";
import { loginSchema, registerSchema } from "../schemas/auth.schema";
import { z } from "zod";
import * as crypto from "../lib/crypto";
import * as jwt from "../lib/jwt";

export default class AuthServices {
  async register(userData: z.infer<typeof registerSchema>) {
    const existingUser = await prisma.user.findUnique({
      where: { email: userData.email },
    });

    if (existingUser) {
      throw new Error("Email already registered!");
    }

    const hashedPassword = await crypto.hashValue(userData.password);

    const user = await prisma.user.create({
      data: {
        email: userData.email,
        username: userData.username,
        password: {
          create: {
            hash: hashedPassword,
          },
        },
      },
      include: {
        password: true,
      },
    });

    return user;
  }

  async login(userData: z.infer<typeof loginSchema>) {
    const user = await prisma.user.findUnique({
      where: { email: userData.email },
      include: { password: true },
    });

    if (
      !user ||
      !(await crypto.verifyvalue(userData.password, user.password?.hash))
    ) {
      throw new Error("Email or password is incorrect");
    }

    const userId = user.id.toString();

    const createAccessToken = await jwt.createAccesToken(userId);

    return createAccessToken;
  }

  async profile(token: string) {
    const decodedToken = await jwt.validateToken(token);
    if (!decodedToken?.subject) {
      throw new Error("Invalid or expired access token");
    }

    return await prisma.user.findUnique({
      where: { id: decodedToken.subject },
      select: {
        username: true,
        email: true,
      },
    });
  }
}
