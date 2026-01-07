# noteAPIs 🔖

**REST API for notes with SQLite persistence**

A modular REST API for creating, reading, updating, and deleting notes. Built with Express (ES modules), organized into routes, controllers, repositories, and middleware for clean separation of concerns. Data persists in SQLite database.

---

## Features ✅

- **Modular architecture:** Express app split into `src/routes/`, `src/controllers/`, `src/repositories/`, and `src/middleware/`
- **Repository pattern:** Data access layer (`noteRepository.js`) separates database logic from controllers
- **SQLite persistence:** Data persists across server restarts using SQLite database
- **Global error handling:** Centralized error handling with `asyncHandler` and `errorHandler` middleware
- **Validation middleware:** `validatesCreatedNotes` and `validatesUpdatedNotes` for request validation
- **Full CRUD API:** `POST /notes`, `GET /notes`, `GET /notes/:id`, `PATCH /notes/:id`, `DELETE /notes/:id`
- **Auto database initialization:** Database and table created automatically on first run

## Project Structure 📁

```
noteAPIs/
├── server.js                           # Entry point (initializes DB & starts app)
├── dev.sqlite3                         # SQLite database file (auto-generated)
├── src/
│   ├── app.js                          # Express app config, route mounting & error handler
│   ├── controllers/
│   │   └── noteControllers.js          # Business logic: createNotes, getNotes, getNotesById, updateNotes, deleteNotes
│   ├── repositories/
│   │   └── noteRepository.js           # Data access layer: getAll, create, getById, updateById, deleteById
│   ├── middleware/
│   │   ├── asyncHandler.js              # Wraps async controllers to catch errors
│   │   ├── errorHandler.js              # Global error handling middleware
│   │   └── notemiddleware.js            # Request validation: validatesCreatedNotes, validatesUpdatedNotes
│   ├── routes/
│   │   └── noteRouters.js              # Route definitions (POST/GET/PATCH/DELETE)
│   └── db/
│       └── db.js                        # Knex database config & initDb function
├── package.json                        # Dependencies & scripts
└── README.md                           # This file
```

---

## Quickstart ⚡

### Prerequisites

- Node.js (use nvm or Homebrew on macOS)
- npm

### Install & Run

```bash
# Install dependencies
npm install

# Start server (production)
npm start

# Start server with auto-reload (development)
npm run dev
```

The server listens on port `3000` (or `PORT` from `.env` file) and logs:
```
Database & Notes table created!
Server running at http://localhost:3000
```

**Note:** The SQLite database (`dev.sqlite3`) and `notes` table are created automatically on first run.

---

## API Endpoints 🔧

### Create a note
- **POST** `/notes`
- **Body:** `{ "title": "...", "content": "..." }`
- **Response:** `201 Created` with the created note (includes `id` and `createdAt`)
- **Validation:** Both `title` and `content` required

```bash
curl -X POST http://localhost:3000/notes \
  -H 'Content-Type: application/json' \
  -d '{"title":"First Note","content":"Hello World"}'
```

### List all notes
- **GET** `/notes`
- **Response:** `200 OK` with array of notes

```bash
curl http://localhost:3000/notes
```

### Get a single note
- **GET** `/notes/:id`
- **Response:** `200 OK` with note object or `404 Not Found`

```bash
curl http://localhost:3000/notes/1
```

### Update a note
- **PATCH** `/notes/:id`
- **Body:** `{ "title": "..." }` and/or `{ "content": "..." }` (partial updates accepted)
- **Response:** `200 OK` with updated note, or `404 Not Found`
- **Validation:** At least one of `title` or `content` required

```bash
curl -X PATCH http://localhost:3000/notes/1 \
  -H 'Content-Type: application/json' \
  -d '{"content":"Updated content"}'
```

### Delete a note
- **DELETE** `/notes/:id`
- **Response:** `204 No Content` on success or `404 Not Found`

```bash
curl -X DELETE http://localhost:3000/notes/1
```

---

## How it works 🔄

### Request Flow
1. **Request:** Client → `server.js` → `src/app.js` → `src/routes/noteRouters.js`
2. **Validation:** Middleware (`src/middleware/notemiddleware.js`) validates request body
3. **Error handling:** `asyncHandler` wraps async controllers to catch errors
4. **Business logic:** Controller (`src/controllers/noteControllers.js`) handles the operation
5. **Data access:** Repository (`src/repositories/noteRepository.js`) interacts with SQLite database
6. **Response:** Controller returns JSON with appropriate status code
7. **Error handling:** If error occurs, `errorHandler` middleware sends consistent error response

**Example flow for creating a note:**
```
POST /notes
  → validatesCreatedNotes (middleware)
  → asyncHandler(createNotes)
  → createNotes (controller)
  → NoteRepository.create() (repository)
  → SQLite database insert
  → res.status(201).json()
```

### Error Handling
- **Async errors:** Caught by `asyncHandler` wrapper and passed to Express error handler
- **Global handler:** `errorHandler` middleware (in `app.js`) handles all errors consistently
- **Status codes:**
  - `500` for unexpected errors
  - `404` for not found (handled in controllers)
  - `400` for validation errors (handled in middleware)

---

## Implementation Details 🔍

### Technology Stack
- **Express 5.x:** Web framework with ES modules
- **Knex.js:** SQL query builder for SQLite
- **SQLite3:** Lightweight database for data persistence
- **dotenv:** Environment variable management

### Architecture Patterns
- **Repository Pattern:** Data access logic separated from business logic
- **Middleware Pattern:** Request validation and error handling via Express middleware
- **Async/Await:** Modern async handling with automatic error catching

### Database Schema
```sql
notes
├── id (INTEGER PRIMARY KEY AUTOINCREMENT)
├── title (TEXT NOT NULL)
├── content (TEXT)
└── createdAt (TIMESTAMP DEFAULT CURRENT_TIMESTAMP)
```

### Status Codes
- `201` — Resource created
- `200` — Success (GET, PATCH)
- `204` — Resource deleted (no body returned)
- `400` — Invalid request (validation errors)
- `404` — Resource not found
- `500` — Internal server error

---

## Environment Variables 🔐

Create a `.env` file in the root directory:

```env
PORT=3000
NODE_ENV=development
```

The server defaults to port `3000` if `PORT` is not set.

---

## Next Steps 💡

- Add tests using `supertest` + `vitest` (or `jest`) for route validation
- Add a GitHub Actions workflow for CI/linting
- Add pagination for `GET /notes` endpoint
- Add search/filter functionality
- Add user authentication and authorization
- Add request rate limiting
- Add API documentation with Swagger/OpenAPI

---

## Learning Notes 📚

This project demonstrates:
- **RESTful API design** with proper HTTP methods and status codes
- **Separation of concerns** with routes, controllers, repositories, and middleware
- **Error handling** patterns in Express with async/await
- **Database integration** with Knex.js and SQLite
- **ES modules** syntax for modern JavaScript

---