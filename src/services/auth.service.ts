import prisma from "../lib/db";
import { loginSchema, registerSchema } from "../schemas/auth.schema";
import { z } from "zod";
import * as crypto from "../lib/crypto";
import * as jwt from "../lib/jwt";

type registerSchema = z.infer<typeof registerSchema>

// Menerima data user dari body berupa object
// Validate data handled by Zod
// Existing user handling
// Otomatis user ini jadi punya role User
export const register = async (
  { userData }: { userData: registerSchema}
) => {
  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [
        {
          username: userData.username
        },
        {
          email: userData.email
        }
      ]
    }
  });

  if (existingUser) {
    throw new Error("Email or Password already registered")
  }

  let role = await prisma.role.findFirst({
    where: {
      roleName: "USER",
    }
  })

  if (!role) {
    role = await prisma.role.create({
      data: {
        roleName: "USER",
        description: "This role can be buyer only"
      }
    })
  }

  const hashedPassword = await crypto.hashValue(userData.password);
  const registeredUSer = await prisma.user.create({
    data: {
      username: userData.username,
      password: hashedPassword,
      email: userData.email,
      roles: {
        create: {
          roleId: role.id
        }
      }
    }
  })

  return registeredUSer;
}