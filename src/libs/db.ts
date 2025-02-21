import { PrismaClient } from "@prisma/client";
import Redis from "ioredis";

const prisma = new PrismaClient();

const redisUrl = {
    password: process.env.REDIS_PASSWORD as string,
    host: process.env.REDIS_HOST as string,
    port: process.env.REDIS_PORT,
};

export const redis = new Redis({
    password: redisUrl.password,
    host: redisUrl.host,
    port: Number(redisUrl.port),
    tls: {}
});

redis.on('error', (err) => {
    console.error('Redis Client Error:', err);
});

redis.on('connect', () => {
    console.log("Connected to Redis 😁");
});

export default prisma;
