import { PrismaClient } from "@prisma/client";
import { createClient } from 'redis';

const prisma = new PrismaClient();

const redisUrl = {
    username: process.env.REDIS_USER as string,
    password: process.env.REDIS_PASSWORD as string,
    host: process.env.REDIS_HOST as string,
    port: process.env.REDIS_PORT,
};

const client = createClient({
    username: redisUrl.username,
    password: redisUrl.password,
    socket: {
        host: redisUrl.host,
        port: Number(redisUrl.port)
    }
});

client.on('error', err => console.log('Redis Client Error', err));

client.connect();
console.log("Connect to redis 😁");

export default prisma;
