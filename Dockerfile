FROM node:23-slim

WORKDIR /app

RUN apt-get update && apt-get install -y \
    git bash curl \
    && rm -rf /var/lib/apt/lists/*

COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install

COPY . .

EXPOSE 3000

CMD ["pnpm", "dev"]