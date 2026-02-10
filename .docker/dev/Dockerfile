# .docker/dev/Dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN corepack enable && \
    corepack prepare pnpm@latest --activate && \
    pnpm install --frozen-lockfile

EXPOSE 5173

CMD ["pnpm", "run", "dev", "--", "--host"]