# ActionFlow

ActionFlow converts meeting notes into trackable action items and helps teams manage follow-ups from meetings.

## Project Structure

- `client/` - React, TypeScript, Vite, Tailwind CSS, React Router, Axios, shadcn/ui
- `server/` - Node.js, Express, TypeScript API
- `prisma/` - Prisma schema and database migrations

## Local Environment

Copy `.env.example` to `.env` and provide real values before running migrations or starting the API.

## Local Development

```bash
npm install
npm run prisma:generate
npm run prisma:migrate
npm run dev
```

The API runs on `http://localhost:4000` and the client runs on `http://localhost:5173` by default.

## Environment Variables

Use these values locally and configure equivalent variables in Railway, Vercel, and Neon:

- `DATABASE_URL` - Neon PostgreSQL connection string
- `JWT_SECRET` - long random secret used to sign access tokens
- `JWT_EXPIRES_IN` - token lifetime, for example `7d`
- `PORT` - backend port, defaults to `4000`
- `CLIENT_URL` - frontend origin for CORS
- `VITE_API_URL` - browser-facing API base URL, for example `https://your-api.railway.app/api`

## Deployment

### Database: Neon PostgreSQL

1. Create a Neon project and database.
2. Copy the pooled PostgreSQL connection string.
3. Set `DATABASE_URL` in Railway with the Neon connection string.
4. Run migrations from the backend deploy environment:

```bash
npm run prisma:deploy
```

### Backend: Railway

1. Create a Railway service from this repository.
2. Set the service root to `server` if deploying only the backend package, or use the root with npm workspaces.
3. Configure environment variables: `DATABASE_URL`, `JWT_SECRET`, `JWT_EXPIRES_IN`, `CLIENT_URL`, and `PORT`.
4. Build command:

```bash
npm install && npm run prisma:generate && npm run build --workspace server
```

5. Start command:

```bash
npm run start --workspace server
```

### Frontend: Vercel

1. Create a Vercel project for `client/`.
2. Set `VITE_API_URL` to the Railway API URL with `/api`.
3. Build command:

```bash
npm run build
```

4. Output directory:

```bash
dist
```

## API Summary

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/dashboard`
- `GET /api/meetings`
- `POST /api/meetings`
- `GET /api/meetings/:id`
- `DELETE /api/meetings/:id`
- `GET /api/tasks`
- `POST /api/tasks`
- `PATCH /api/tasks/:id`
- `DELETE /api/tasks/:id`
