# noteAPIs 🔖

**Simple in-memory Express API for notes**

A modular REST API for creating, reading, updating, and deleting notes. Built with Express (ES modules), organized into routes, controllers, and middleware for clean separation of concerns. Data is stored in memory and does not persist across restarts.

---

## Features ✅

- **Modular architecture:** Express app split into `src/routes/`, `src/controllers/`, and `src/middleware/`
- **Clean separation:** Router layer (`noteRouters.js`) → Controller layer (`noteControllers.js`) → Data store
- **Validation middleware:** `validatesCreatedNotes` and `validatesUpdatedNotes` for request validation
- **In-memory store:** `notes` array with numeric `noteId` counter
- **Full CRUD API:** `POST /notes`, `GET /notes`, `GET /notes/:id`, `PATCH /notes/:id`, `DELETE /notes/:id`

## Project Structure 📁

```
noteAPIs/
├── server.js                           # Entry point (starts the app)
├── src/
│   ├── app.js                          # Express app config & route mounting
│   ├── controllers/
│   │   └── noteControllers.js          # Business logic: createNotes, getNotes, getNotesById, updateNotes, deleteNotes
│   ├── middleware/
│   │   └── noteMiddleware.js           # Request validation: validatesCreatedNotes, validatesUpdatedNotes
│   └── routes/
│       └── noteRouters.js              # Route definitions (POST/GET/PATCH/DELETE)
├── package.json                        # Dependencies & scripts
└── README.md                           # This file
```

---

## Quickstart ⚡

Prerequisites:

- Node.js (use nvm or Homebrew on macOS)

Install & run:

```bash
# install deps
npm install

# start server
npm start

# (recommended for development with auto-reload)
npm i -D nodemon
# then add to package.json scripts: "dev": "nodemon server.js"
npm run dev
```

The server listens on port `3000` and logs `Server running at http://localhost:3000`.

---

## API Endpoints 🔧

### Create a note
- **POST** `/notes`
- **Body:** `{ "title": "...", "content": "..." }`
- **Response:** `201 Created` with the created note (includes `id` and `createdAt`)
- **Validation:** Both `title` and `content` required

```bash
curl -sS -X POST http://localhost:3000/notes \
  -H 'Content-Type: application/json' \
  -d '{"title":"First","content":"Hello"}'
```

### List all notes
- **GET** `/notes`
- **Response:** `200 OK` with array of notes

```bash
curl http://localhost:3000/notes
```

### Get a single note
- **GET** `/notes/:id`
- **Response:** `200 OK` or `404 Not Found` (bad `id` returns `400`)

```bash
curl http://localhost:3000/notes/1
```

### Update a note
- **PATCH** `/notes/:id`
- **Body:** `{ "title": "..." }` and/or `{ "content": "..." }` (partial updates accepted)
- **Response:** `200 OK` with updated note, or `400`/`404` for invalid data/not found
- **Validation:** At least one of `title` or `content` required

```bash
curl -X PATCH http://localhost:3000/notes/1 \
  -H 'Content-Type: application/json' \
  -d '{"content":"Updated"}'
```

### Delete a note
- **DELETE** `/notes/:id`
- **Response:** `204 No Content` on success or `404 Not Found`

```bash
curl -X DELETE http://localhost:3000/notes/1
```

---

## How it works 🔄

1. **Request flow:** Client → `server.js` → `src/app.js` → `src/routes/noteRouters.js`
2. **Validation:** Middleware (`src/middleware/noteMiddleware.js`) validates request body
3. **Business logic:** Controller (`src/controllers/noteControllers.js`) handles the operation
4. **Storage:** In-memory `notes` array (defined in `noteControllers.js`)
5. **Response:** Controller returns JSON with appropriate status code

**Example flow for creating a note:**
```
POST /notes → validatesCreatedNotes (middleware) → createNotes (controller) → notes.push() → res.status(201).json()
```

---

## Implementation details 🔍

- **ES modules:** `package.json` has `"type": "module"`, all files use `import`/`export`
- **Data store:** In-memory `notes` array defined in `src/controllers/noteControllers.js`; `noteId` counter increments on each create
- **Middleware:** Separate validation functions for POST (both fields) and PATCH (at least one field)
- **Status codes:**
  - `201` — resource created
  - `204` — resource deleted (no body returned)
  - `400` — invalid request (missing fields or bad id)
  - `404` — resource not found

---

## Next suggestions 💡

- Add tests using `supertest` + `vitest` (or `jest`) for route validation
- Add a GitHub Actions workflow for CI/linting
- Add a `.env` file for PORT configuration
- Persist data to a database (e.g., SQLite, MongoDB) to survive restarts

---

