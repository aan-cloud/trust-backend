# Stage 1: Builder
FROM oven/bun:latest AS builder

WORKDIR /app

# Copy package.json dan install dependencies di builder stage
COPY package.json ./ 
RUN bun install --frozen-lockfile

# Copy seluruh aplikasi
COPY . .

# Generate Prisma client (pastikan database sudah siap atau dilakukan di runtime)
RUN bun run prisma generate

# Stage 2: Runtime
FROM oven/bun:latest

WORKDIR /app

# Salin dependencies dan aplikasi dari builder stage
COPY --from=builder /app /app

# Salin file .env ke dalam container dan set environment variables
COPY .env .env

# Install dependencies hanya untuk produksi
RUN bun install --production

# Expose port untuk aplikasi
EXPOSE 3000

# Start aplikasi
CMD ["bun", "start"]