FROM node:20-alpine

WORKDIR /app

RUN npm install -g pnpm

COPY package.json pnpm-workspace.yaml ./
COPY apps/server/package.json ./apps/server/

RUN pnpm install --filter server

COPY apps/server ./apps/server

RUN pnpm --filter server build

WORKDIR /app/apps/server

EXPOSE 3000

CMD ["node", "dist/index.js"]