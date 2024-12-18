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
    port: Number(redisUrl.port),
    maxRetriesPerRequest: 50,
});

redis.ping()
    .then((res) => {
        console.log("Redis is connected:", res);
    })
    .catch((err) => {
        console.error("Redis connection error:", err);
    });

redis.on('error', (error) => {  
    console.error('Redis error:', error);  
});

export default prisma;
