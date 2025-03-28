FROM oven/bun AS build

WORKDIR /app

# Cache packages installation
COPY package.json bun.lock tsconfig.json ./
COPY src ./src

RUN bun install

ENV NODE_ENV=production

CMD ["bun", "run", "./src/index.ts"]

EXPOSE 3000