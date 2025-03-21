FROM oven/bun AS build

WORKDIR /app

# Cache packages installation
COPY . .

RUN bun install

ENV NODE_ENV=production

CMD ["bun", "run", "./src/index.ts"]

EXPOSE 3000