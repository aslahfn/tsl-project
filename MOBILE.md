# TSL Super League — Mobile + API

This repo now includes:

- **`/`** — Next.js web app (existing)
- **`backend/`** — NestJS REST API + Socket.IO (port **3001**)
- **`mobile/`** — React Native (Expo) mobile app

Both the web admin and mobile app share the same SQLite database (`prisma/dev.db`).

## Quick start

### 1. Seed the database (if empty)

```bash
npm run db:seed
```

Default admin: `admin@tsl.com` / `admin123`

### 2. Start the NestJS API

```bash
cd backend
cp .env.example .env   # already created if you cloned with defaults
npm run start:dev
```

API base URL: `http://localhost:3001/api`

### 3. Start the mobile app

```bash
cd mobile
cp .env.example .env
npm start
```

### Environment variables

#### Backend (`backend/.env`)

| Variable | Description |
|----------|-------------|
| `PORT` | API port (default `3001`) |
| `DATABASE_URL` | SQLite path (default `file:../prisma/dev.db`) |
| `JWT_SECRET` | Access token signing secret |
| `JWT_REFRESH_SECRET` | Refresh token secret (reserved) |
| `CORS_ORIGINS` | Allowed mobile/web origins |
| `INTERNAL_API_KEY` | Key for Next.js admin event forwarding |

#### Mobile (`mobile/.env`)

| Variable | Description |
|----------|-------------|
| `EXPO_PUBLIC_API_BASE_URL` | REST API URL (default `http://localhost:3001/api`) |
| `EXPO_PUBLIC_SOCKET_URL` | Socket.IO URL (default `http://localhost:3001`) |

**Android emulator:** use `http://10.0.2.2:3001` instead of `localhost`.

**Physical device:** use your machine's LAN IP, e.g. `http://192.168.1.10:3001`.

#### Next.js web (optional, for admin → mobile realtime bridge)

Add to `.env.local`:

```
NESTJS_API_URL=http://localhost:3001
INTERNAL_API_KEY=tsl-internal-dev-key
```

## API endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/api/auth/register` | No | Register |
| POST | `/api/auth/login` | No | Login |
| POST | `/api/auth/logout` | No | Logout (revoke refresh token) |
| POST | `/api/auth/refresh` | No | Refresh access token |
| GET | `/api/auth/me` | JWT | Current user |
| GET | `/api/teams` | No | All teams |
| GET | `/api/teams/:slug` | No | Team detail + squad |
| GET | `/api/players` | No | All players (`?teamId=`) |
| GET | `/api/players/:id` | No | Player detail |
| GET | `/api/fixtures` | No | All fixtures (`?status=`) |
| GET | `/api/fixtures/results` | No | Finished matches |
| GET | `/api/fixtures/live` | No | Live matches |
| GET | `/api/standings` | No | League table |
| GET | `/api/news` | No | News articles |
| GET | `/api/news/:slug` | No | Article detail |
| GET | `/api/notifications` | No | Notifications |
| PATCH | `/api/notifications/:id/read` | No | Mark read |

### WebSocket (Socket.IO)

- Namespace: `/realtime`
- Event: `event` — payloads with `type`: `GOAL_EVENT`, `SCORE_UPDATE`, `STANDINGS_UPDATE`, `KICKOFF_ALERT`

## Mobile architecture

```
mobile/src/
├── api/           # Axios client + service layer
├── hooks/         # useTeams, usePlayers, useFixtures, etc.
├── context/       # AuthProvider, RealtimeProvider
├── storage/       # Secure token storage (expo-secure-store)
├── services/      # Socket.IO + push notifications
├── components/    # LoadingState, ErrorState, EmptyState, DataView
├── screens/       # All feature screens
└── types/         # TypeScript API interfaces
```

Features:
- JWT auth with secure token storage and auto-login on restart
- Automatic token refresh via Axios interceptors
- Loading, error, retry, and empty states on every screen
- Real-time refresh via Socket.IO when backend data changes
- Local push notifications for goals and kickoff alerts
