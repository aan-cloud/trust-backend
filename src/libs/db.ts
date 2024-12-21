import { PrismaClient } from "@prisma/client";
import Redis from "ioredis";

const prisma = new PrismaClient();

const redisUrl = {
    username: process.env.REDIS_USER as string,
    password: process.env.REDIS_PASSWORD as string,
    host: process.env.REDIS_HOST as string,
    port: process.env.REDIS_PORT,
};

export const redis = new Redis({
    username: redisUrl.username,
    password: redisUrl.password,
    host: redisUrl.host,
    port: Number(redisUrl.port)
});

redis.on('error', (err) => {
    console.error('Redis Client Error:', err);
});

redis.on('connect', () => {
    console.log("Connected to Redis 😁");
});

export default prisma;
