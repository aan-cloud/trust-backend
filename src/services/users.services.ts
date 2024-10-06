import prisma from "../lib/db";

export default class UserServices {
  async getAlluser() {
    return await prisma.user.findMany({
      select: {
        id: true,
        username: true,
      },
    });
  }

  async getUsername(username: string) {
    return await prisma.user.findUnique({
      where: { username },
      select: {
        id: true,
        username: true,
      },
    });
  }
}
