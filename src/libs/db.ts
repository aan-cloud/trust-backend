import { PrismaClient } from "@prisma/client";
import Redis from "ioredis";

const prisma = new PrismaClient();

export const redis = new Redis({
    port: 6380,
    host: "127.0.0.1",
    password: "my-top-secret",
    db: 4,
});

redis.ping().then((res) => {
    console.log("Redis is connected:", res);
}).catch((err) => {
    console.error("Redis connection error:", err);
});


export default prisma;
