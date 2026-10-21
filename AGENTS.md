<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Project workflow and stack

Attendy is a role-based attendance app built with Next.js, PostgreSQL, and Drizzle. Keep implementation decisions consistent with the current code, this file, and the user’s latest explicit direction.

### Workspace methodology

- Before editing, inspect the relevant files and repository status. Preserve existing user changes and avoid resetting, reverting, or broadly cleaning the workspace.
- Make the smallest cohesive change that completes the request. Do not bundle unrelated refactors, dependency changes, generated files, or cleanup into the task.
- If a request materially changes architecture, data ownership, deployment, or user flow, explain the options and agree on the approach before making that architectural change. For routine implementation details, use the established project patterns and proceed.
- Keep user-facing behavior and documentation aligned with what is implemented. Clearly label unfinished flows as planned or placeholders; do not describe them as complete.
- Use Docker Compose for local app work and for requested checks. Do not start a separate host-side Next.js server.
- Do not add or run tests unless requested. When the user asks for a check or the task requires a smoke check, use the existing Compose app and report exactly what ran and the outcome.
- Do not delete database volumes, user records, or other user data unless the user explicitly asks for that specific removal. `docker compose down -v` erases local Compose database data.

### Next.js and React

- Use Next.js 16 App Router and the current `app/` route-group structure. Keep routes and server actions server-first; add Client Components only for state, effects, browser APIs, or event handling.
- This project enables `cacheComponents`, `partialPrefetching`, and `agentFeedback` in `next.config.ts`. Before changing Next.js APIs, routing, caching, prefetching, or server/client boundaries, read the matching guide under `node_modules/next/dist/docs/` and heed deprecations.
- Keep browser components away from database credentials and direct database access. Read and mutate data through server components, server actions, or route handlers as appropriate to the existing flow.
- Preserve responsive behavior, keyboard access, labels, focus visibility, and meaningful empty states when changing the UI. Follow the existing Tailwind CSS 4, Base UI, shared UI component, and theme-token patterns.
- The generated `nextjs-agent-rules` block above is managed by `next dev`. Do not remove or rewrite it; inspect `node_modules/next/dist/server/lib/generate-agent-files.js` if its origin or behavior matters.

### Authentication, roles, and user flow

- Authentication uses Auth.js v5 Credentials, Zod 4 validation, and Node `scrypt` password hashing. Keep credentials and password hashes on the server.
- PostgreSQL is authoritative for account roles and profile status. New accounts default to `student`; never accept a role from an unauthenticated form or rely on a client-supplied role for access control.
- Load the current user from the authenticated session and database before serving protected role routes or performing protected mutations. Direct URL entry must enforce the same role/profile checks as in-app navigation.
- Preserve the current flow: student → complete student profile → student dashboard; teacher → complete teacher profile → create a first class if needed → teacher dashboard; admin → protected admin placeholder.
- Keep sign-in return paths same-origin and use the existing safe redirect helper. Route unauthenticated users to login with a safe return path.
- Do not invent or expose admin role-management behavior. It remains unimplemented until the user requests it.

### PostgreSQL and Drizzle

- Use Drizzle ORM with the existing PostgreSQL dialect, `pg` driver, `db/index.ts` connection setup, `db/schema.ts` schema, and `drizzle/` migrations. Inspect these files before changing database behavior; do not guess credentials, driver, table names, or connection configuration.
- Treat PostgreSQL as the central source of truth. In development, the app connects to the local PostgreSQL Compose service named `db`. Production Compose connects to an external PostgreSQL server supplied through `DATABASE_URL` and does not launch a database service.
- For schema changes, update `db/schema.ts`, generate a migration with `npm run db:generate` inside the app container, review the SQL, apply with `npm run db:migrate`, and keep the migration with the schema change. Never rely on a local volume as the schema migration mechanism.
- Do not alter an already-applied shared/production migration; create a forward migration.
- Use `docker compose exec app npm run db:studio` from the project root to start Drizzle Studio. Development maps its port to `localhost:4983`.

### Package management and Compose commands

- Use Node.js 22, npm 10, and the committed `package-lock.json`. Do not introduce Bun commands, lockfiles, or runtime dependencies. Use `npm ci` when installing from the lockfile.
- Run the development app and local PostgreSQL with `docker compose up --build` from the repository root. The app is available at `http://localhost:3000`; the database hostname from inside Compose is `db`, not `localhost`.
- Run project commands in the app service, for example `docker compose exec app npm run lint` or `docker compose exec app npm run db:migrate`.
- Use `docker compose -f compose.production.yaml ...` for production image or migration workflows. Production requires externally supplied `DATABASE_URL`, `AUTH_URL`, and a unique `AUTH_SECRET`.
- Do not run `docker compose down -v` unless the user explicitly wants the local database volumes erased.

### Documentation

- Keep `README.md` accurate about the actual stack, local and production Compose behavior, commands, migrations, authentication, roles, and incomplete features.
- Use PowerShell examples for commands that are specific to the current Windows workspace; use portable shell commands only when they work in the container.
