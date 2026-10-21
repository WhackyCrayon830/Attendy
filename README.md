# Attendy

> **Beyond the Roll Call.**

Attendy is an attendance-focused web application in development. The project is being built to make attendance workflows more useful than a simple roll call. The current codebase is an early foundation: it contains the Next.js starter page, initial login and signup routes, and the local/production database setup. Product flows and database tables are still to be implemented.

## Technology stack

| Area | Technology | Role |
| --- | --- | --- |
| Web application | Next.js 16 App Router, React 19, TypeScript | Server-rendered application and UI |
| Styling | Tailwind CSS 4 | Utility-first styling |
| Database | PostgreSQL 17 for local development | Shared relational data store |
| Database access | Drizzle ORM with `pg` (node-postgres) | Typed PostgreSQL queries and schema management |
| Runtime and package manager | Bun 1.4.3 | Dependency installation and app scripts |
| Containers | Docker and Docker Compose | Consistent development and production app images |

The application uses Next.js server-side code to access PostgreSQL. Browser code should call the application; database credentials and direct database connections must stay on the server.

## Project structure

```text
app/
  (marketing)/       Public landing route
  (auth)/             Login and signup route scaffolding
  dashboard/          Reserved for the authenticated app
db/
  index.ts            Server-only Drizzle connection pool
  schema.ts           PostgreSQL table definitions
drizzle/              Generated SQL migrations (created when migrations are generated)
compose.yaml           Development app and local PostgreSQL
compose.production.yaml Production app connected to an external PostgreSQL database
Dockerfile             Development and production build stages
drizzle.config.ts      Drizzle Kit configuration
```

## Development

### Requirements

- Docker Desktop with Docker Compose
- Ports `3000` and `5432` available on your laptop

### Start the app and database

From the project root, run:

```bash
docker compose up --build
```

Open [http://localhost:3000](http://localhost:3000). Compose starts the Next.js app in development mode and a real PostgreSQL container for local data. The app connects to PostgreSQL at `db:5432` inside the Compose network; database tools on the laptop can connect at `localhost:5432`.

The local database uses a named Docker volume, so its data remains after the containers stop. Its credentials are for local development only. Stop the foreground services with `Ctrl+C`, or run `docker compose down` in another terminal.

Useful development commands:

```bash
docker compose logs -f app db       # Follow app and database logs
docker compose exec app bun run lint # Run ESLint in the app container
```

The development container installs dependencies from `bun.lock` at startup, so changes to the dependency manifest are reflected when the service is rebuilt or restarted.

## Database workflow

Define PostgreSQL tables in `db/schema.ts`. The Drizzle connection is server-only and is exported from `db/index.ts`; import it only from server-side application code.

After changing the schema, generate and review a migration, then apply it to the local database:

```bash
docker compose exec app bun run db:generate
docker compose exec app bun run db:migrate
```

Generated SQL migration files are written to `drizzle/`. Commit schema changes and their reviewed migrations together. Use migrations to update shared or production databases; do not rely on the development database's persisted volume as a schema source of truth.

## Production Compose

Production Compose builds the Next.js app in production mode and connects it to an existing PostgreSQL database. PostgreSQL can be hosted by a managed database provider or run on infrastructure reachable from the app container; production Compose does not start a database container.

1. Copy `.env.example` to `.env` and set `DATABASE_URL` to the production database connection string. Keep the real `.env` file private and out of version control.
2. Build the production image:

   ```bash
   docker compose -f compose.production.yaml build app
   ```

3. Apply migrations against the production database:

   ```bash
   docker compose -f compose.production.yaml run --rm app bun run db:migrate
   ```

4. Start the production app:

   ```bash
   docker compose -f compose.production.yaml up -d
   ```

The database host in `DATABASE_URL` must be reachable from the app container. `localhost` refers to the app container itself. Use a private network or a secure managed connection, and do not expose PostgreSQL publicly without an appropriate network and access policy.

## Package scripts

Run scripts in the app container during development:

| Command | Purpose |
| --- | --- |
| `bun run dev` | Start Next.js development mode |
| `bun run build` | Build the Next.js app for production |
| `bun run start` | Start the production Next.js server |
| `bun run lint` | Run ESLint |
| `bun run db:generate` | Generate Drizzle SQL migrations from the schema |
| `bun run db:migrate` | Apply generated migrations |

For example, run the production build in its Docker image with `docker compose -f compose.production.yaml build app`.
