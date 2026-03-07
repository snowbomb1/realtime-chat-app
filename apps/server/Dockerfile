FROM node:20-alpine
WORKDIR /app
RUN npm install -g pnpm
COPY package.json pnpm-workspace.yaml ./
COPY pnpm-lock.yaml ./
COPY apps/server/package.json ./apps/server/
RUN pnpm install
RUN find /app -name "node_modules" -type d
COPY apps/server ./apps/server
WORKDIR /app/apps/server
RUN pnpm exec prisma generate --schema=src/prisma/schema.prisma
RUN pnpm run build
EXPOSE 3000
WORKDIR /app
CMD ["node", "apps/server/dist/index.js"]