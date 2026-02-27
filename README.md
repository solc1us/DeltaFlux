# DeltaFlux

A minimal, production-ready **personal finance / transaction tracking** REST API built with Node.js, TypeScript, Express, Prisma ORM, and PostgreSQL.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js |
| Language | TypeScript (strict mode) |
| Framework | Express 5 |
| ORM | Prisma 7 |
| Database | PostgreSQL |
| Auth | JWT (`jsonwebtoken`) + bcrypt (`bcryptjs`) |
| DB Driver | `pg` via `@prisma/adapter-pg` |
| Rate limiting | `express-rate-limit` |

---

## Project Structure

```
DeltaFlux/
├── prisma/
│   └── schema.prisma          # Data models (User, Category, Transaction)
├── src/
│   ├── app.ts                 # Express app — middleware, routes, error handler
│   ├── server.ts              # HTTP server bootstrap
│   ├── config/
│   │   ├── env.ts             # Validated environment variables
│   │   └── prisma.ts          # PrismaClient singleton (pg adapter)
│   ├── controllers/
│   │   └── auth.controller.ts # Thin HTTP handlers — delegates to services
│   ├── middleware/
│   │   ├── auth.middleware.ts  # JWT Bearer token verification
│   │   └── error.middleware.ts # Global error handler
│   ├── routes/
│   │   ├── auth.routes.ts     # POST /api/auth/register · /login
│   │   └── index.ts           # Route aggregator under /api
│   ├── services/
│   │   └── auth.service.ts    # Business logic — register, login
│   └── types/
│       └── index.ts           # AuthPayload, AuthRequest types
├── .env.example               # Environment variable template
├── prisma.config.ts           # Prisma 7 datasource configuration
└── tsconfig.json              # TypeScript strict mode config
```

---

## Prerequisites

- Node.js ≥ 18
- PostgreSQL running locally (or a remote connection string)
- `npm` ≥ 9

---

## Getting Started

### 1 — Install dependencies

```bash
npm install
```

### 2 — Configure environment variables

```bash
cp .env.example .env
```

Edit `.env` and fill in your values:

```env
PORT=3000
NODE_ENV=development

DATABASE_URL="postgresql://user:password@localhost:5432/deltaflux?schema=public"

JWT_SECRET=your_super_secret_key_here
JWT_EXPIRES_IN=7d
```

> **Note:** The server will **refuse to start** if `DATABASE_URL` or `JWT_SECRET` are missing.

### 3 — Run database migrations

```bash
npm run prisma:migrate
```

This creates all tables (`users`, `categories`, `transactions`) and the composite indexes.

### 4 — Generate the Prisma client

```bash
npm run prisma:generate
```

### 5 — Start the development server

```bash
npm run dev
```

The server starts on `http://localhost:3000` (or the port set in `.env`).

---

## Available Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start in development mode with `ts-node` |
| `npm run build` | Compile TypeScript to `dist/` |
| `npm start` | Run compiled output (`dist/server.js`) |
| `npm run prisma:generate` | Regenerate the Prisma client |
| `npm run prisma:migrate` | Run migrations in development |
| `npm run prisma:studio` | Open Prisma Studio (database GUI) |

---

## API Reference

### Health check

```
GET /health
```

Response `200`:
```json
{ "status": "ok" }
```

---

### Auth

#### Register

```
POST /api/auth/register
Content-Type: application/json
```

Body:
```json
{
  "name": "Alice",
  "email": "alice@example.com",
  "password": "secret123"
}
```

Response `201`:
```json
{
  "token": "<jwt>",
  "user": { "id": "<uuid>", "name": "Alice", "email": "alice@example.com" }
}
```

| Status | Reason |
|---|---|
| 201 | User created |
| 409 | Email already in use |
| 429 | Rate limit exceeded |

---

#### Login

```
POST /api/auth/login
Content-Type: application/json
```

Body:
```json
{
  "email": "alice@example.com",
  "password": "secret123"
}
```

Response `200`:
```json
{
  "token": "<jwt>",
  "user": { "id": "<uuid>", "name": "Alice", "email": "alice@example.com" }
}
```

| Status | Reason |
|---|---|
| 200 | Login successful |
| 401 | Invalid email or password |
| 429 | Rate limit exceeded |

---

### Using the JWT token

Pass the token as a `Bearer` header on protected routes:

```
Authorization: Bearer <jwt>
```

The `authMiddleware` in `src/middleware/auth.middleware.ts` validates this token and attaches `req.user` (`{ userId, email }`) to the request.

---

## Data Models

### User

| Field | Type | Notes |
|---|---|---|
| `id` | `String` (UUID) | Primary key |
| `name` | `String` | |
| `email` | `String` | Unique |
| `passwordHash` | `String` | bcrypt, cost factor 12 |
| `createdAt` | `DateTime` | Auto |
| `updatedAt` | `DateTime` | Auto |

### Category

| Field | Type | Notes |
|---|---|---|
| `id` | `String` (UUID) | Primary key |
| `name` | `String` | Unique per user |
| `userId` | `String` | FK → User (cascade delete) |
| `createdAt` | `DateTime` | Auto |
| `updatedAt` | `DateTime` | Auto |

### Transaction

| Field | Type | Notes |
|---|---|---|
| `id` | `String` (UUID) | Primary key |
| `userId` | `String` | FK → User (cascade delete) |
| `categoryId` | `String` | FK → Category (restrict delete) |
| `amount` | `Decimal(18,2)` | Supports large values, precise |
| `description` | `String?` | Optional |
| `transactionDate` | `DateTime` | |
| `createdAt` | `DateTime` | Auto |
| `updatedAt` | `DateTime` | Auto |

**Composite indexes on `transactions`:**

- `(userId, transactionDate)` — fast date-range queries per user
- `(userId, categoryId, transactionDate)` — fast category + date filtering per user

---

## Security

- **Passwords** are hashed with bcrypt (cost factor 12) and never stored in plaintext.
- **JWT secrets** must be set via `JWT_SECRET`; the server rejects startup without it.
- **Auth endpoints** are rate-limited to **20 requests per 15 minutes** per IP.
- **Error messages** for auth failures are intentionally generic to prevent user enumeration.
- **Stack traces** are only included in error responses when `NODE_ENV=development`.

---

## License

ISC
