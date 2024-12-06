import { PrismaClient } from "@prisma/client";
import Redis from "ioredis";

const prisma = new PrismaClient();

export const redis = new Redis({
    port: 6379, // Redis port
    host: "127.0.0.1", // Redis host
    username: "default", // needs Redis >= 6
    password: "my-top-secret",
    db: 4, // Defaults to 0
});

redis.on("error", (err) => {
    console.error("Detailed Redis Error: ", err);
    console.error(err.stack);
});

export default prisma;
