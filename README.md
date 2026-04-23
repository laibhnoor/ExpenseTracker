Expense Tracker

A full-stack expense tracker with React + Vite on the frontend and Node.js + Express + Prisma + PostgreSQL on the backend.

## Tech Stack

- Frontend: React, Vite, Tailwind CSS
- Backend: Node.js, Express
- Database: PostgreSQL (Neon), Prisma ORM
- Auth: JWT, bcrypt

## Local Setup

1. Clone the repository:

```bash
git clone https://github.com/your-username/expense-tracker.git
cd expense-tracker
```

2. Configure backend environment:

```bash
cd server
cp .env.example .env
```

Update values in `server/.env`.

3. Install backend dependencies and run migrations:

```bash
npm install
npx prisma migrate dev
```

4. Start backend:

```bash
npm run dev
```

5. Configure frontend environment:

```bash
cd ../client
cp .env.example .env
```

6. Install frontend dependencies and start frontend:

```bash
npm install
npm run dev
```

## Render Deployment (API + Client)

This repository includes a Render Blueprint file at `render.yaml`.

### Backend scripts used in Render

In `server/package.json`, deployment uses:

- `postinstall`: generates Prisma client
- `prisma:migrate:deploy`: applies pending migrations
- `start:render`: runs migrations, then starts Express

### Step-by-step

1. Push this repo to GitHub.
2. In Render, choose New +, then Blueprint.
3. Select your repository so Render reads `render.yaml`.
4. Render creates two services:
	- `expense-tracker-api` (Node web service)
	- `expense-tracker-client` (static site)
5. Set backend environment variables in Render for `expense-tracker-api`:
	- `DATABASE_URL` (Neon connection string)
	- `JWT_SECRET`
	- `CLIENT_ORIGIN` (your frontend Render URL)
	- `ALLOWED_ORIGINS` (optional comma-separated list)
6. Set frontend environment variable in Render for `expense-tracker-client`:
	- `VITE_API_URL` = `https://<your-backend-service>.onrender.com/api`
7. Trigger deploy.
8. Verify API health at:
	- `https://<your-backend-service>.onrender.com/api/health`
9. Open your frontend URL and test signup/login and transactions.

## Notes for Neon

- Use the Neon pooled connection string for `DATABASE_URL`.
- SSL is handled by Neon connection URL parameters.
- Prisma migrations in production are applied with `prisma migrate deploy`.
