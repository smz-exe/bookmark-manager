FROM node:23-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git bash curl \
    && rm -rf /var/lib/apt/lists/*

# Install pnpm globally (as root)
RUN npm install -g pnpm

# First copy package.json and pnpm-lock.yaml
COPY package.json pnpm-lock.yaml ./

# Copy the rest of the files
COPY . .

EXPOSE 3000

CMD ["pnpm", "dev"]
