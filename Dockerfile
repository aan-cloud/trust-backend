FROM oven/bun:debian

WORKDIR /usr/src/app

COPY . .

RUN bun install 

RUn bun run generate

CMD ["bun", "start"]