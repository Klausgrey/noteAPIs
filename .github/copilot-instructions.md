# Copilot / AI agent instructions for noteAPIs

Brief summary
- Modular Express API (ES modules) for CRUD operations on notes. Entry: `server.js` → `src/app.js` → routes/controllers/middleware.
- Data stored in-memory in `src/controllers/noteControllers.js` as `notes` array with numeric `noteId` counter. Does not persist across restarts.

Architecture & patterns
- **Modular structure:** `src/routes/noteRouters.js` (routes) → `src/controllers/noteControllers.js` (business logic) → `src/middleware/noteMiddleware.js` (validation)
- Express app created in `src/app.js` with `app.use(express.json())` for JSON parsing
- In-memory data store: `let notes = []; let noteId = 1;` (defined in controllers)
- Routes defined on `/notes`:
  - POST `/notes` — create note (expects JSON `{ title, content }`). Middleware: `validatesCreatedNotes`
  - GET `/notes` — list all notes (returns array)
  - GET `/notes/:id` — return single note by numeric id
  - PATCH `/notes/:id` — update fields (title and/or content). Middleware: `validatesUpdatedNotes`
  - DELETE `/notes/:id` — remove note
- Validation middleware: `validatesCreatedNotes` enforces both `title` and `content` for POST; `validatesUpdatedNotes` requires at least one for PATCH

Developer workflows & commands
- Run the app: `npm start` (uses `node server.js`). `package.json` uses `"type": "module"` so ES module syntax is required.
- Recommended dev helper (not present): install `nodemon` (`npm i -D nodemon`) and run `npm run dev` (create a `dev` script to run `nodemon server.js`) for auto-reloads.
- Debugging: use `node --inspect server.js` or a VS Code Node launch configuration. The server logs `Server running at http://localhost:3000`.

Project-specific conventions & important details
- ES module syntax (import/export). All imports require `.js` extensions.
- Data store: `notes` array and `noteId` counter defined in `src/controllers/noteControllers.js`
- IDs are numeric and coerced via `Number(req.params.id)`. Always validate `Number.isNaN(id)` before using.
- Each note includes: `id` (numeric), `title`, `content`, `createdAt` (ISO timestamp)
- Responses and status codes used in code:
  - 201 on create
  - 204 on successful delete (no body)
  - 400 for invalid request data or bad id
  - 404 for not found

Examples (copyable)
- Create note:
  curl -sS -X POST http://localhost:3000/notes -H 'Content-Type: application/json' -d '{"title":"a","content":"b"}'
- Get note:
  curl http://localhost:3000/notes/1
- Update note:
  curl -X PATCH http://localhost:3000/notes/1 -H 'Content-Type: application/json' -d '{"content":"new"}'

Tasks an AI agent can do next (suggestions)
- Add basic tests using `supertest` + `vitest` (or `jest`) for all endpoints (GET all, GET by id, POST, PATCH, DELETE, error cases)
- Add a `dev` script to `package.json`: `"dev": "nodemon server.js"` (requires `npm i -D nodemon`)
- Add a simple GitHub Actions workflow for CI (lint, test on push/PR)
- Add `.env` support for PORT configuration (use `dotenv` package)
- Persist data to a database (SQLite, MongoDB) instead of in-memory
- Add error handling middleware and structured logging

Where to look in this repo
- `server.js` — main entry point; imports and starts the app
- `src/app.js` — Express app setup and route mounting
- `src/routes/noteRouters.js` — all route definitions
- `src/controllers/noteControllers.js` — business logic and in-memory data store
- `src/middleware/noteMiddleware.js` — request validation functions
- `package.json` — shows `type: "module"` and available scripts
- `README.md` — project structure diagram and API documentation