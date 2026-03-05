# Realtime Chat App

A full-stack realtime chat application built with React, TypeScript, Socket.IO, and Express. Users can join with a username, create or join chat rooms, and exchange messages in real time.

## Features

- **Realtime messaging** via WebSockets (Socket.IO)
- **Multiple chat rooms** — create new rooms or join existing ones
- **Live typing indicators** — see when other users are typing
- **Audio notifications** for incoming messages
- **User presence** — per-room user list updated in real time
- **Responsive UI** — mobile-friendly layout using MUI
- **Emoji picker** support in the message input
- **Security** — input sanitization, rate limiting (HTTP & per-socket), and HTTP hardening via Helmet

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, TypeScript, Vite |
| UI Library | MUI (Material UI) v7 |
| Routing | React Router v7 |
| Realtime | Socket.IO Client v4 |
| Backend | Node.js, Express 5 |
| WebSockets | Socket.IO v4 |
| Package Manager | pnpm (workspaces) |

## Project Structure

```
realtime-chat-app/
├── apps/
│   ├── web/               # React frontend (Vite)
│   │   └── src/
│   │       ├── pages/     # Login and Chat pages
│   │       ├── ui/        # Reusable UI components
│   │       └── utils/     # Context providers (Socket, Chat)
│   └── server/            # Express + Socket.IO backend
│       └── src/
│           └── index.ts   # Server entrypoint
├── package.json           # Root workspace config
└── pnpm-workspace.yaml
```

## Getting Started

### Prerequisites

- **Node.js** v18+
- **pnpm** v10+ — install with `npm install -g pnpm`

### Installation

```bash
# Clone the repo
git clone <repo-url>
cd realtime-chat-app

# Install all dependencies
pnpm install
```

### Running the App

Open two terminal windows:

**Start the backend server** (runs on port 3000):
```bash
cd apps/server
pnpm dev
```

**Start the frontend dev server** (runs on port 5173):
```bash
cd apps/web
pnpm dev
```

Then open [http://localhost:5173](http://localhost:5173) in your browser.

## Usage

1. Enter a username on the login page and click **Submit**.
2. Create a new room using the room creation input, or join an existing room from the room list.
3. Type a message and press Enter (or click Send) to chat.
4. The user list shows everyone currently in the room.
5. Click **Log Out** to disconnect and return to the login page.

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/users` | List all connected usernames |
| GET | `/rooms` | List all active room names |
| GET | `/users/:roomId` | List users in a specific room |

## Socket Events

| Event | Direction | Description |
|-------|-----------|-------------|
| `user:join` | Client → Server | Register username on connect |
| `room:create` | Client → Server | Create and join a new room |
| `room:join` | Client → Server | Join an existing room |
| `room:leave` | Client → Server | Leave the current room |
| `message:send` | Client → Server | Send a message to the current room |
| `typing:start` | Client → Server | Notify others that the user is typing |
| `typing:stop` | Client → Server | Notify others that the user stopped typing |
| `message:new` | Server → Client | Broadcast a new message (or system event) |
| `room:list` | Server → Client | Updated list of all rooms |
| `room:users` | Server → Client | Updated user list for a room |
| `typing:update` | Server → Client | Typing status update for a user |
| `error` | Server → Client | Error message (e.g. rate limit hit) |

## Security

- **Input sanitization** — all user-provided strings (usernames, room names, messages) are sanitized with `sanitize-html` before being broadcast.
- **Message length limit** — messages exceeding 500 characters are rejected.
- **Per-socket rate limiting** — users are limited to 10 messages per 5 seconds; exceeding this returns an error event.
- **HTTP rate limiting** — 100 requests per 15-minute window via `express-rate-limit`.
- **HTTP hardening** — security headers applied via `helmet`.
- **CORS** — restricted to the frontend origin (`http://localhost:5173`).
