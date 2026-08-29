# Attendy

**Attendy** is an easy-to-use attendance management application designed for colleges. It helps teachers take attendance, students track their attendance, and administrators manage the entire system from a centralized dashboard.

## Tech Stack

- Next.js
- TypeScript
- Tailwind CSS
- shadcn/ui
- Drizzle ORM
- PostgreSQL
- Bun

---

## Contributing

### 1. Get Contributor Access

Before contributing, **ask the project owner to add you as a GitHub collaborator**.

Contact **WhackyCrayon830** with your GitHub username and accept the repository invitation.

> **Do not fork the repository** unless the project owner specifically asks you to.

Once you have access:

```bash
git clone https://github.com/WhackyCrayon830/Attendy.git
cd Attendy
bun install
```

---

### 2. Start From Latest `main`

Never work directly on `main`.

```bash
git switch main
git pull origin main
```

---

### 3. Create a Branch

Use a descriptive branch name:

```bash
git switch -c feature/<name>
```

Examples:

```bash
feature/auth
feature/student-dashboard
feature/teacher-dashboard
feature/attendance
feature/admin-dashboard
```

For fixes:

```bash
fix/login-error
fix/attendance-calculation
```

For refactoring:

```bash
refactor/database-schema
```

---

### 4. Work on Your Feature

Start the development server:

```bash
bun dev
```

Keep your changes focused on your assigned task.

Check your changes before committing:

```bash
git status
git diff
```

---

### 5. Commit

Use clear commit messages:

```bash
git add .
git commit -m "Add student attendance page"
```

Good examples:

```text
Add teacher attendance table
Implement student dashboard
Fix attendance calculation
Add course enrollment
Update authentication middleware
```

Avoid:

```text
stuff
changes
final
fix
asdf
```

---

### 6. Keep Your Branch Updated

You don't need to update your branch every time `main` changes.

Before creating/merging a PR, however, update it if `main` has moved:

```bash
git fetch origin
git rebase origin/main
```

If conflicts occur:

```bash
# resolve the conflicts
git add .
git rebase --continue
```

After rebasing:

```bash
git push --force-with-lease
```

> Never force-push to `main`.

---

### 7. Push Your Branch

```bash
git push -u origin feature/<name>
```

Then create a **Pull Request** on GitHub:

```text
your-branch → main
```

Include:

- What you changed
- How you tested it
- Screenshots if relevant
- Any known issues

Wait for review before merging.

---

### 8. After Your PR Is Merged

```bash
git switch main
git pull origin main
git branch -d feature/<name>
```

Then create a new branch for your next task.

---

## Project Structure

```text
app/
├── (auth)/
├── (dashboard)/
│   ├── admin/
│   ├── teacher/
│   └── student/
└── api/

components/
├── ui/
├── dashboard/
├── attendance/
└── users/

lib/
└── db/
    ├── index.ts
    └── schema.ts

actions/
types/
drizzle/
drizzle.config.ts
```

### Architecture Rules

- One Next.js application for all three roles.
- `/admin` → Admin dashboard.
- `/teacher` → Teacher dashboard.
- `/student` → Student dashboard.
- Shared components go in `components/`.
- shadcn components go in `components/ui/`.
- Database code goes in `lib/db/`.
- Drizzle schema goes in `lib/db/schema.ts`.
- PostgreSQL is the database.
- Drizzle ORM is the ORM.
- Do not introduce another ORM or framework without discussing it with the project owner.
- Reuse existing components and patterns where possible.
- Do not unnecessarily modify unrelated code.

### Security Rules

- Never rely only on frontend role checks.
- Authorization must be enforced server-side.
- Never expose database credentials or secrets to the client.
- Never commit `.env` files.
- Do not weaken authentication/authorization to implement a feature.

---

## Database Changes

After modifying `lib/db/schema.ts`:

```bash
bunx drizzle-kit generate
bunx drizzle-kit migrate
```

For quick local development:

```bash
bunx drizzle-kit push
```

Do not manually modify the database schema outside the project workflow.

---

## AI Instructions for Contributors

> **IMPORTANT:** Before contributing, copy the entire **AI CONTRIBUTION CONTEXT** below and paste it into your AI coding assistant (ChatGPT, Claude, Cursor, etc.). This helps the AI understand the project's architecture and contribution rules.

### AI CONTRIBUTION CONTEXT

```text
You are helping me contribute to the Attendy project.

Attendy is a college attendance management application built with:
- Next.js
- TypeScript
- Tailwind CSS
- shadcn/ui
- Drizzle ORM
- PostgreSQL
- Bun

GIT RULES:
1. Never work directly on main.
2. Start work from the latest main:
   git switch main
   git pull origin main

3. Create a branch:
   feature/<name>
   fix/<name>
   refactor/<name>

4. Keep changes focused on the assigned task.
5. Do not modify unrelated code unnecessarily.
6. Never commit .env, secrets, credentials, node_modules, or .next.
7. Never force-push to main.
8. If main has changed:
   git fetch origin
   git rebase origin/main

9. After rebasing:
   git push --force-with-lease

10. Test changes before creating a PR.

ARCHITECTURE:
- This is one Next.js application.
- Admin, teacher, and student dashboards are route areas of the same app.
- Admin: /admin
- Teacher: /teacher
- Student: /student
- Shared UI belongs in components/.
- shadcn components belong in components/ui/.
- Database code belongs in lib/db/.
- Drizzle schema belongs in lib/db/schema.ts.
- Reuse existing components and patterns.
- Do not introduce new frameworks, ORMs, or major libraries without asking the project owner.

DATABASE:
- PostgreSQL is used.
- Drizzle ORM is used.
- Do not use Prisma or another ORM.
- Schema changes must be made through the Drizzle schema.
- Generate migrations when appropriate.

SECURITY:
- Never rely only on frontend authorization.
- Perform role/permission checks server-side.
- Never expose secrets or database credentials to the client.
- Do not weaken authentication or authorization.

WHEN IMPLEMENTING A FEATURE:
1. Inspect the existing code first.
2. Follow existing project patterns.
3. Reuse existing components.
4. Make the smallest clean change necessary.
5. Do not rewrite unrelated code.
6. Tell me which files were changed.
7. Tell me how to test the changes.
8. If the database changes, tell me which Drizzle commands to run.
9. Prefer existing project conventions over introducing new patterns.
```

---

## Quick Workflow

```bash
# Update main
git switch main
git pull origin main

# Create branch
git switch -c feature/my-feature

# Develop
bun dev

# Commit
git add .
git commit -m "Implement my feature"

# Push
git push -u origin feature/my-feature

# Create PR:
# feature/my-feature → main
```

**Keep `main` stable. Keep branches focused. Use Pull Requests.**
