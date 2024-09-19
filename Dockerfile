FROM oven/bun:debian

WORKDIR /usr/src/app

COPY . .

RUN bun install 

# RUN bun run generate

CMD ["bun", "start"]