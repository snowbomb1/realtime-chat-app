# Realtime Chat App

A full-stack realtime chat application built with React, TypeScript, Socket.IO, and Express. Users can register and log in, create or join chat rooms, and exchange messages in real time.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, TypeScript, Vite |
| UI Library | MUI (Material UI) v7 |
| Routing | React Router v7 |
| Realtime | Socket.IO v4 |
| Backend | Node.js, Express 5 |
| Database | PostgreSQL (via Prisma) |
| Auth | JWT + bcrypt |
| Package Manager | pnpm (workspaces) |

## Features

- **Authentication** — register/login with username and password; sessions managed via JWT (24h expiry)
- **Realtime messaging** via WebSockets
- **Multiple chat rooms** — create new rooms or join existing ones
- **Live typing indicators**
- **User presence** — per-room user list updated in real time
- **Emoji picker** in the message input
- **Audio notifications** for incoming messages
- **Security** — input sanitization, bcrypt password hashing, per-socket and HTTP rate limiting, Helmet headers

## Project Structure

```
realtime-chat-app/
├── apps/
│   ├── web/        # React frontend (Vite)
│   └── server/     # Express + Socket.IO backend
├── package.json    # Root workspace config
└── pnpm-workspace.yaml
```

## Getting Started

Requires Node.js v18+, pnpm v10+, and a PostgreSQL database.

Set `DATABASE_URL` and `JWT_SECRET` in `apps/server/.env`, then:

```bash
pnpm install
pnpm --filter server exec prisma db push --schema=src/prisma/schema.prisma
pnpm --filter server dev   # backend on :3000
pnpm --filter web dev      # frontend on :5173
```

## Deployment

The backend is deployed to **Fly.io** and the frontend to **Vercel**. A GitHub Actions workflow handles automatic backend deploys on push to `main`.