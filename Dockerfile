# Use the official Bun image with Debian Linux
# Oven is the company name, the creator of Bun
FROM oven/bun:debian

# Create and change to the app directory
WORKDIR /usr/src/app

# Copy app files
COPY . .

# Copy the .env file to make sure Docker can read environment variables
COPY .env .env

# Install dependencies
RUN bun install --frozen-lockfile

# Generate Prisma
RUN bun generate

# Run the application
CMD ["bun", "start"]