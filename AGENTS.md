<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Project stack and conventions

- Use Next.js 16 with the App Router. Follow the current project’s `app/` structure and server-first React conventions; add Client Components only when browser-side state, effects, or event handling require them.
- This project enables `cacheComponents`, `partialPrefetching`, and the `agentFeedback` experiment in `next.config.ts`. Read the relevant version-matched guides in `node_modules/next/dist/docs/` before changing Next.js APIs or routing, caching, prefetching, or server/client behavior. Follow deprecation notices and existing configuration.
- Use Drizzle ORM for database schemas and queries. Keep schema definitions, migrations, and database access consistent with the existing Drizzle setup; inspect the configured dialect and patterns before adding or changing database code. Do not guess the database driver or connection configuration.
- Use Tailwind CSS 4 and the project’s existing CSS/Turbopack setup for styling. Preserve established design and component patterns when extending the UI.
- Use TypeScript and the existing Bun scripts and lockfile for project commands and dependency management.
- Run the application through the repository’s Docker Compose configuration when starting it for testing or visual verification (`docker compose up --build`). Do not start a separate host-side Next.js dev server for these checks; use the `app` service defined in `compose.yaml`.
